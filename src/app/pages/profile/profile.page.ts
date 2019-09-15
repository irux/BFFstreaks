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
  public streaks : Array<any> = new Array()
  public bffs : Array<any> = new Array()

  constructor(
    private userSrv: UserService, 
    private friendSrv: FriendsFinderService, 
    public share: SharingService,
    private geofire: GeoFirestoreService) { 
    }


    //get the user when you log in
    async ngOnInit(){
      this.user = await this.userSrv.getUserLoggedIn()
      let observableCheckins = await this.userSrv.getMyCheckins()
      observableCheckins.subscribe((data) => this.handleCheckins(data))
    }


    private handleCheckins(data){
      console.log("Here is data!")
      console.log(data)
      let checkins = new Array()
      for(let checkinData of data){
        console.log("Here is checking data")
        console.log(checkinData)
        checkins.push(checkinData["d"])
      }

      this.handleStreaks(checkins)
      
    }


    private sortByCheckins(a,b){
      if(a["checkins"] > b["checkins"]){
        return 1
      }
      if(b["checkins"] > a["checkins"]){
        return -1
      }

      return 0
    }

    private async handleStreaks(checkins : Array<any>){
      let myself = await this.userSrv.getUserLoggedIn()
      let streaksArray = new Array()
 
      let onlyStreaks = checkins.filter((data) => data["streak"] == true)
      onlyStreaks = onlyStreaks.sort(this.sortByCheckins)

      for(let checkin of onlyStreaks){

        let keys = Object.keys(checkin["users"])
        let usernameAsArray = keys.filter((data) => checkin["users"][data] != myself.username)

        let nowDate = new Date()
        let nowDateUTC = this.convertToUTC(nowDate)

        let dateCheckin = new Date(checkin["date"].toDate())
        dateCheckin.setHours(dateCheckin.getHours() + 24)

        let difference = Math.floor(Math.abs( (nowDateUTC as any) - (dateCheckin as any)) / 36e5)

        streaksArray.push({
          username:usernameAsArray[0],
          profilePicture:checkin["users"][usernameAsArray[0]]["profilePicture"],
          date:checkin["date"].toDate(),
          streak: checkin["streak"],
          checkins: checkin["checkins"],
          differenceHours: difference
        })
      }

      this.streaks = streaksArray

    }

    //user
    user:UserBFF


    //list

    //Change the list that you're looking at
    view_list:String = "streaks" //default
    selectList(name:String){
      this.view_list = name
    }


    private convertToUTC(date: Date) {
      let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        return new Date(now_utc)
    }
  
  
}
