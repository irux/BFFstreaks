import { Component } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { FriendsFinderService } from '../../services/friends-finder-service/friends-finder.service';
import { GeoFirestoreService } from '../../services/geofirestore-service/geo-firestore.service';
import * as firebase from 'firebase/app'
import { Subscription } from 'rxjs';
import { SelectorListContext } from '@angular/compiler';
import { UserBFF } from '../../types/User';
import { SharingService } from '../../services/sharing-service/sharing.service';
import { AnalyticsService } from 'src/app/services/analytics-service/analytics.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  private subs : Subscription;
  public streaks : Array<any> = new Array()
  public bffs : Array<any> = new Array()
  public checkinsSubscription : Subscription

  constructor(
    private userSrv: UserService, 
    private friendSrv: FriendsFinderService, 
    public share: SharingService,
    private analytics: AnalyticsService,
    private geofire: GeoFirestoreService) { 
    }


    //get the user when you log in
    
    async ionViewWillEnter(){
      this.analytics.logEvent("Opened Profile Page")
      this.user = await this.userSrv.getUserLoggedIn()
      let observableCheckins = await this.userSrv.getMyCheckins()
      this.checkinsSubscription = observableCheckins.subscribe((data) => this.handleCheckins(data))
    }

    async ionViewWillLeave(){
      console.log("Leaving scanning page...")
      this.checkinsSubscription.unsubscribe();
    }

    private handleCheckins(data){
      console.log(data);

      
      


      let checkins = new Array()
      for(let checkinData of data){
        
        checkins.push(checkinData["d"])
      }

      checkins = checkins.sort(this.sortByCheckins)

      this.handleStreaks(checkins)
      this.handleBffs(checkins)
      
    }

    private async handleBffs(bffsChekins){
      
      let myself = await this.userSrv.getUserLoggedIn()
      let bffsArrays = new Array()

      

      console.log("Esto es bffscheckins")
      console.log(bffsChekins)

      for(let checkin of bffsChekins){

      console.log(checkin)

      let keys = Object.keys(checkin["users"])
      console.log("Here is myself")
      console.log(myself.username)
      console.log(keys)
      let usernameAsArray = keys.filter((data) => checkin["users"][data]["username"] !== myself.username)
      console.log(usernameAsArray)

      bffsArrays.push({
        username:usernameAsArray[0],
        profilePicture:checkin["users"][usernameAsArray[0]]["profilePicture"],
        date:checkin["date"].toDate(),
        checkins: checkin["checkins"],
      })

    }

    this.bffs = bffsArrays

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

      for(let checkin of onlyStreaks){

        let keys = Object.keys(checkin["users"])
        let usernameAsArray = keys.filter((data) => checkin["users"][data]["username"] !== myself.username)

        let nowDate = new Date()
        let nowDateUTC = this.convertToUTC(nowDate)

        let dateCheckin = new Date(checkin["date"].toDate())
        dateCheckin.setHours(dateCheckin.getHours() + 24)

        console.log(dateCheckin.toDateString())
        console.log(nowDateUTC.toDateString())
        console.log(dateCheckin.getTime() - nowDateUTC.getTime())

        let difference = Math.floor( (dateCheckin.getTime() - nowDateUTC.getTime()) / 36e5)

        difference = difference >= 0 ? difference : 0

        console.log("Here is difference")
        console.log(difference)

        if(difference == 0){
          checkin["streak"] = false
          continue;
        }
        
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
      this.analytics.logEvent("Profile Page view "+name+" list")
      this.view_list = name
    }


    private convertToUTC(date: Date) {
      let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        return new Date(now_utc)
    }
  
  
}
