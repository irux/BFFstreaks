import { Component } from '@angular/core';
import { UserService } from '../services/user-service/user.service';
import { FriendsFinderService } from '../services/friends-finder-service/friends-finder.service';
import { GeoFirestoreService } from '../services/geofirestore-service/geo-firestore.service';
import * as firebase from 'firebase/app'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  private subs : Subscription;

  constructor(private userSrv: UserService, private friendSrv: FriendsFinderService, private geofire: GeoFirestoreService) { }


  public async register() {
    let obser = await this.friendSrv.startSearchingPeople()
    this.subs = obser.subscribe((people) => console.log(people))
  }

  public async stop(){
    this.subs.unsubscribe()
    this.friendSrv.stopSearchingPeople()
  }


}
