import { Component } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { FriendsFinderService } from '../../services/friends-finder-service/friends-finder.service';
import { GeoFirestoreService } from '../../services/geofirestore-service/geo-firestore.service';
import * as firebase from 'firebase/app'
import { Subscription } from 'rxjs';
import { SelectorListContext } from '@angular/compiler';
import { UserBFF } from '../../types/User';
import { SharingService } from '../../services/sharing-service/sharing.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  private subs : Subscription;

  constructor(
    private userSrv: UserService, 
    private friendSrv: FriendsFinderService, 
    public share: SharingService,
    private geofire: GeoFirestoreService) { 
    }


    //get the user when you log in
    async ngOnInit(){
      this.user = await this.userSrv.getUserLoggedIn()
    }

    //user
    user:UserBFF


    //list
    streaks = [
      {
        nickname: "vicky133",
        avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
        streak:true,
        streak_count:21,
        hours_left:20,
        last_met:1
      },
      {
        nickname: "alejo96",
        avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
        streak:true,
        streak_count:12,
        hours_left:12,
        last_met:1
      },
      {
        nickname: "beatrice",
        avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
        streak:true,
        streak_count:9,
        hours_left:3,
        last_met:1
      },
      {
        nickname: "valentino",
        avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
        streak:false,
        streak_count:0,
        hours_left:0,
        last_met:5
      }
    ]
    all = [
      {
        nickname: "valentino",
        avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
        longest_streak:1,
        total_count:30
      },
      {
        nickname: "alejo96",
        avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
        longest_streak:10,
        total_count:10
      },
      {
        nickname: "beatriice11",
        avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
        longest_streak:3,
        total_count:8
      },
      {
        nickname: "mamma",
        avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
        longest_streak:1,
        total_count:2
      }
  ]

    //Change the list that you're looking at
    view_list:String = "streaks" //default
    selectList(name:String){
      this.view_list = name
    }

  
  
}
