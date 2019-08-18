import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { BehaviorSubject, Subscription, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {


  private locationObservable : Subject<Position>
  private locationSubscription : Subscription


  constructor(private locationSrv : Geolocation) { }


  private processGeolocation(geo : Geoposition){
    this.locationObservable.next(geo)
  }

  public async listenRealTimeLocation() : Promise<Observable<Geoposition>>{


    if(this.locationObservable === null || this.locationObservable === undefined){
      this.locationObservable =  new Subject()
      
    }


    this.locationSubscription = this.locationSrv.watchPosition()
    .subscribe((position : Geoposition) => this.processGeolocation(position))
    
    return this.locationObservable
  }

  public stopListenRealTimeLocation(){

    if(this.locationObservable === null || this.locationObservable === undefined){
      throw new Error("The location was not activated!")
    }

    if (this.locationSubscription === null || this.locationSubscription === undefined){
      throw new Error("Something went wrong stopping the geolocation listener!")
    }
    
    this.locationSubscription.unsubscribe();
    this.locationObservable.complete();
    this.locationObservable = null
    
  }

}
