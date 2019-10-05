import { Injectable } from '@angular/core';
import { GeoCollectionReference, GeoFirestore, GeoQuery, GeoQuerySnapshot, GeoFirestoreTypes } from 'geofirestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { ReplaySubject, Subject } from 'rxjs';
import { MeetRequest } from 'src/app/types/MeetRequest';
import { on } from 'cluster';
import { UserBFF } from 'src/app/types/User';
import { User } from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class GeoFirestoreService {

  private subscribeFunctionQuery
  private geofire : GeoFirestore
  private friendsNearByObservable : Subject<Array<UserBFF>> = new Subject<Array<UserBFF>>()
  private rankingNearby : Subject<Array<UserBFF>> = new Subject<Array<UserBFF>>()
  

  constructor(private db: AngularFirestore
  ) {
    let referenceFirestore = this.db.firestore
    this.geofire = new GeoFirestore(referenceFirestore)
    
  }
  public add(collection : string, data : GeoFirestoreTypes.DocumentData) : void
  public add(collection : string, data : GeoFirestoreTypes.DocumentData , documentID : string) : void

  public add(collection : string, data : GeoFirestoreTypes.DocumentData,  documentID? : string){
    
    const geocollection: GeoCollectionReference = this.geofire.collection(collection)
    if(documentID)
    {
      geocollection.doc(documentID).set(data)
    }
    else{
      geocollection.add(data)
    }
  }

  public update(collection : string, data : GeoFirestoreTypes.DocumentData,  documentID? : string){
    const geocollection: GeoCollectionReference = this.geofire.collection(collection)
    geocollection.doc(documentID).update(data)
  }


  private processDocuments(documents : GeoFirestoreTypes.QueryDocumentSnapshot[] ){
      let docInfo = new Array()
      for(let document of documents){
        let dataDocument = document.data()
        docInfo.push(dataDocument)
      }
      return docInfo;
  }


  private processQueryGeolocation(query : GeoQuery){
    this.subscribeFunctionQuery = query.onSnapshot((snapshot) => {
        let processedDocuments = this.processDocuments(snapshot.docs)
        this.friendsNearByObservable.next(processedDocuments)
    })
  }


  

  public near(collection : string , query : GeoFirestoreTypes.QueryCriteria) {
    

    if(this.subscribeFunctionQuery !== null && this.subscribeFunctionQuery !== undefined)
    {
      this.subscribeFunctionQuery()
      this.subscribeFunctionQuery = undefined
    }

    let selectedCollection = this.geofire.collection(collection)
    let resultQuery : GeoQuery =  selectedCollection.near(query)
    this.processQueryGeolocation(resultQuery)
    
    return this.friendsNearByObservable

  }


  public async nearRanking(collection : string , query : GeoFirestoreTypes.QueryCriteria) {
    
    let selectedCollection = this.geofire.collection(collection)
    let resultQuery : GeoQuery =  selectedCollection.near(query)
    resultQuery = resultQuery.where("streak","==",true)
    return await resultQuery.get()

  }


  public stopNearSubscription(){
    if(this.subscribeFunctionQuery === null || this.stopNearSubscription === undefined){
      throw new Error("The subscription nearby was never activated!")
    }

    this.subscribeFunctionQuery()

  }
}
