import { Injectable } from '@angular/core';
import { GeoLocationService } from '../geolocation-service/geo-location.service';
import { Geoposition } from '@ionic-native/geolocation/ngx';
import { AngularFirestore, AngularFirestoreModule, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user-service/user.service';
import { GeoCollectionReference, GeoFirestore, GeoQuery, GeoQuerySnapshot } from 'geofirestore';
import { GeoFirestoreService } from '../geofirestore-service/geo-firestore.service';
import * as firebase from 'firebase/app'
import { Observable, ReplaySubject, Subscription, Subject } from 'rxjs';
import { MeetRequest } from 'src/app/types/MeetRequest';
import { UserBFF } from 'src/app/types/User';

@Injectable({
  providedIn: 'root'
})
export class FriendsFinderService {

  private myLastLocation: Geoposition
  private subscriptionLocations: Subscription
  private subscriptionPeople: Subscription
  private peopleArround: Subject<Array<UserBFF>> = new Subject<Array<UserBFF>>()
  private mail: Subject<any> = new Subject<any>();



  private searchRadius: number = 0.07

  constructor(
    private geolocationSrv: GeoLocationService,
    private db: AngularFirestore,
    private userSrv: UserService,
    private geofire: GeoFirestoreService
  ) {
    this.init()
  }


  private async init() {
    let userFirebase = await this.userSrv.getMyUserFirebase()
    userFirebase.subscribe((data) => this.handleInfoUser(data))
  }

  private handleInfoUser(data) {
    if ("mailbox" in data) {
      this.handleMail(data["mailbox"])
    }

    

  }

  private handleMail(mail) {
    this.mail.next(mail)
  }

  

  /**
   * This function helps to process the Geolocation.
   * It only process the new geolocation every 15 seconds.
   */
  private processMyLocation(location: Geoposition) {

    if (this.myLastLocation === null || this.myLastLocation === undefined) {
      this.myLastLocation = location
    }
    if (!this.enoughTimePass(location.timestamp, this.myLastLocation.timestamp))
      return

    this.myLastLocation = location

    this.processPeople(location)
  }



  private processPeople(location: Geoposition) {
    if (this.subscriptionPeople !== null && this.subscriptionPeople !== undefined) {
      this.subscriptionPeople.unsubscribe()
    }

    try {
      this.geofire.stopNearSubscription()
    } catch (e) {
      console.log(e)
    }
    this.makeMeSearchable(location)
    let searchObject = { center: new firebase.firestore.GeoPoint(location.coords.latitude, location.coords.longitude), radius: this.searchRadius }
    let nearPeople = this.geofire.near("searchable", searchObject)
    this.subscriptionPeople = nearPeople.subscribe(async (people) => {
      let listOfPeople = await this.processList(people)
      this.notifyPeople(listOfPeople)
    })
  }

  private async processList(listPeople: Array<UserBFF>): Promise<Array<UserBFF>> {
    let user = await this.userSrv.getUserLoggedIn()
    let newList = listPeople
      .map((element) => element["user"])
      .filter((element) => element["username"] !== user.username)
    return newList
  }


  private notifyPeople(people: Array<UserBFF>) {
    this.peopleArround.next(people)
  }


  /**
   * This function compare both timestamps
   * 
   * @param timestamp1 The most actual timestamp to compare with
   * @param timestamp2 The old timestamp to compare with
   * 
   * @returns it returns true if you have enough time between timestamp, otherwise false
   */
  private enoughTimePass(timestamp1: number, timestamp2: number): boolean {
    let difference = 30 * 1000

    if (timestamp1 === timestamp2) {
      return true
    }

    if (timestamp1 - timestamp2 < difference) {
      return false
    }
    return true
  }

  /**
   * This function start the search function for people around you.
   * 
   * @returns It returns an Observable that emits an array of the people around you
   */
  public async startSearchingPeople(): Promise<Observable<Array<UserBFF>>> {
    let myLocationObservable = await this.geolocationSrv.listenRealTimeLocation()
    this.subscriptionLocations = myLocationObservable.subscribe((geopos) => this.processMyLocation(geopos))
    return this.peopleArround
  }

  public async handShakeUser(user: string) {
    console.log(user)
    let myself = await this.userSrv.getUserLoggedIn()
    const { username, profilePicture } = myself
    let subSetUsername = { username, profilePicture }
    let newMessageMailbox = {}
    newMessageMailbox["mailbox"] = {}
    newMessageMailbox["mailbox"][myself.username] = {}
    newMessageMailbox["mailbox"][myself.username]["user"] = subSetUsername
    newMessageMailbox["mailbox"][myself.username]["message"] = "I'd like to check in with you"
    newMessageMailbox["mailbox"][myself.username]["date"] = firebase.firestore.FieldValue.serverTimestamp();
    let referenceUser = await this.db.collection("users").doc(user).update(newMessageMailbox)

  }


  public async canHandShake(user: string): Promise<boolean> {
    let myself = await this.userSrv.getUserLoggedIn()

    let documentID = this.getIdFromUsernames(user, myself.username)

    let docReference = this.db.collection("checkin").doc(documentID)

    let doc = await docReference.get().toPromise()

    if (!doc.exists)
      return true

    let docData = doc.data()

    

    let checkinTimestamp = docData["d"]["date"].toDate()
    checkinTimestamp.setHours(checkinTimestamp.getHours() + 24)
    

    let nowTime = new Date()

    let utcNowTime = this.convertToUTC(nowTime)
    console.log("Here is utctimenow")
    console.log(utcNowTime.getTime())
    console.log("Here is checkin timestamp")
    console.log(checkinTimestamp.getTime())

    if (utcNowTime.getTime() >= checkinTimestamp.getTime()){
      return true;
    }
    else{
      return false
    }

  }


  private convertToUTC(date: Date) {
    let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
      return new Date(now_utc)
  }


  private async deleteMailFrom(user : string){

    let myself = await this.userSrv.getUserLoggedIn()

    let updateObject = {["mailbox."+user]:firebase.firestore.FieldValue.delete()}
    
    let deleteMail = await this.db.collection("users").doc(myself.username).update(updateObject)

  }

  

  private async getLastTimeHandshakedTime(id : string){
    let checkin = await this.db.collection("checkin").doc(id).get().toPromise()
    if(!checkin.exists){
      throw new Error(`The checkin with the id ${id} doesn't exist`)
    }
    let checkinInfo = checkin.data()

    return checkinInfo["d"]["date"].toDate()

  }


  private createCheckinObject(user1 : UserBFF , user2 : UserBFF,streakEnable : boolean){

    let checkinObject = {
      coordinates: new firebase.firestore.GeoPoint(this.myLastLocation.coords.latitude, this.myLastLocation.coords.longitude)
    }
    checkinObject["users"] = {}
    checkinObject["users"][user1.username] = {username:user1.username,profilePicture:user1.profilePicture}
    checkinObject["users"][user2.username] = {username:user2.username,profilePicture:user2.profilePicture}
    checkinObject["usersInCheck"] = {}
    checkinObject["usersInCheck"][user1.username] = true
    checkinObject["usersInCheck"][user2.username] = true

    checkinObject["checkins"] = firebase.firestore.FieldValue.increment(1)
    checkinObject["date"] = firebase.firestore.FieldValue.serverTimestamp()
    checkinObject["streak"] = streakEnable

    return checkinObject

  }

  public async responseHandshake(userObject: UserBFF) {
    
    let user = userObject.username

    this.deleteMailFrom(user)
    
    let myself = await this.userSrv.getUserLoggedIn()

    let documentID = this.getIdFromUsernames(user, myself.username)
    
    let straksEnable = false
    try{
      let lastTimeHandshakeTime = await this.getLastTimeHandshakedTime(documentID)
      let todaysDate = new Date()
      todaysDate.setHours(todaysDate.getHours() + 48)
      let maximalDateStreakPermission = this.convertToUTC(todaysDate)
      if(lastTimeHandshakeTime.getTime() <= maximalDateStreakPermission.getTime()){
        straksEnable = true
      }
    }catch(e){
      console.log("The checkin doesn't exist, maybe it is because of a new checking between new people")
    }

    let checkinObject = this.createCheckinObject(userObject,myself,straksEnable)
    let existDocument = await this.checkingExist(documentID)
    console.log("Here exist document")
    console.log(existDocument)
    if(existDocument)
    {
      this.geofire.update("checkin", checkinObject, documentID)
    }
    else{
      this.geofire.add("checkin",checkinObject,documentID)
    }

  }


  private async checkingExist(id : string){
    let document = await this.db.collection("checkin").doc(id).get().toPromise()
    if(document.exists)
    {
      return true
    }
    else{
      return false
    }
  }


  private getIdFromUsernames(username1: string, username2: string) {
    let id = null
    if (username1 >= username2) {
      id = `${username1}-${username2}`
    }
    else {
      id = `${username2}-${username1}`
    }
    return id
  }


  public async getHandshakes(): Promise<Observable<any>> {
    return this.mail;
  }


  public async stopSearchingPeople() {
    await this.makeMeInvisible()
    this.subscriptionLocations.unsubscribe()
    try {
      this.geofire.stopNearSubscription()
    }
    catch (e) { }
  }


  private async makeMeSearchable(location: Geoposition) {
    let user = await this.userSrv.getUserLoggedIn()
    let searchObject = {
      user: user,
      coordinates: new firebase.firestore.GeoPoint(location.coords.latitude, location.coords.longitude)
    }
    this.geofire.add("searchable", searchObject, user.username)
  }


  public async makeMeInvisible() {
    let user = await this.userSrv.getUserLoggedIn()
    let collectionSearch = this.db.collection("searchable")
    await collectionSearch.doc(user.username).delete()
  }


}
