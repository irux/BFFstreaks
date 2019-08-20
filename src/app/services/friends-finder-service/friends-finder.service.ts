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

  private myLastLocation : Geoposition
  private subscriptionLocations : Subscription
  private subscriptionPeople : Subscription
  private peopleArround : Subject<Array<UserBFF>> = new Subject<Array<UserBFF>>()
  private searchRadius : number = 0.07

  constructor(
    private geolocationSrv: GeoLocationService,
    private db: AngularFirestore,
    private userSrv: UserService,
    private geofire : GeoFirestoreService
  ) {
    

  }

  /**
   * This function helps to process the Geolocation.
   * It only process the new geolocation every 15 seconds.
   */
  private processMyLocation(location : Geoposition){

    if(this.myLastLocation === null || this.myLastLocation === undefined){
      this.myLastLocation = location
    }
    if(!this.enoughTimePass(location.timestamp, this.myLastLocation.timestamp))
      return

    this.myLastLocation = location

    this.processPeople(location)
  }



  private processPeople(location : Geoposition){
      if(this.subscriptionPeople !== null && this.subscriptionPeople !== undefined){
        this.subscriptionPeople.unsubscribe()
      }

      try{
        this.geofire.stopNearSubscription()
      }catch(e){
        console.log(e)
      }
      this.makeMeSearchable(location)
      let searchObject = { center: new firebase.firestore.GeoPoint(location.coords.latitude,location.coords.longitude), radius: this.searchRadius }
      let nearPeople = this.geofire.near("searchable",searchObject)
      this.subscriptionPeople = nearPeople.subscribe(async (people) => {
        let listOfPeople = await this.processList(people)
        this.notifyPeople(listOfPeople)
      })
  }

  private async processList(listPeople : Array<UserBFF>) : Promise<Array<UserBFF>>{
    let user = await this.userSrv.getUserLoggedIn()
    let newList = listPeople.filter((element) => element["user"]["username"] !== user.username)
    return newList
  }


  private notifyPeople(people : Array<UserBFF>){
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
  private enoughTimePass(timestamp1 : number, timestamp2 : number) : boolean
  {
    let difference = 15 * 1000

    if(timestamp1 === timestamp2){
      return true
    }

    if(timestamp1 - timestamp2 < difference){
      return false
    }
    return true
  }

  /**
   * This function start the search function for people around you.
   * 
   * @returns It returns an Observable that emits an array of the people around you
   */
  public async startSearchingPeople() : Promise<Observable<Array<UserBFF>>> {
    let myLocationObservable = await this.geolocationSrv.listenRealTimeLocation()
    this.subscriptionLocations = myLocationObservable.subscribe((geopos) => this.processMyLocation(geopos))
    return this.peopleArround
  }

  public async handShakeUser(user : string){
    let myself = await this.userSrv.getUserLoggedIn()

    let newMessageMailbox = {}
    newMessageMailbox["mailbox"] = {}
    newMessageMailbox["mailbox"][myself.username] = {}
    newMessageMailbox["mailbox"][myself.username]["user"] = myself
    newMessageMailbox["mailbox"][myself.username]["message"] = "I'd like to check in with you"
    
    let referenceUser = await this.db.collection("users").doc(user).update(newMessageMailbox)

    
  }

  public async stopSearchingPeople(){
    await this.makeMeInvisible()
    this.subscriptionLocations.unsubscribe()
    try{
      this.geofire.stopNearSubscription()
    }
    catch(e){}
  }

  private async makeMeSearchable(location : Geoposition) {
    let user = await this.userSrv.getUserLoggedIn()
    let searchObject = {
      user:user,
      coordinates: new firebase.firestore.GeoPoint(location.coords.latitude,location.coords.longitude)
    }
    this.geofire.add("searchable",searchObject,user.username)
  }


  public async makeMeInvisible(){
    let user = await this.userSrv.getUserLoggedIn()
    let collectionSearch = this.db.collection("searchable")
    await collectionSearch.doc(user.username).delete()
  }


}
