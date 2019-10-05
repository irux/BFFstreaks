import { Component } from '@angular/core';
import { SharingService } from '../../services/sharing-service/sharing.service';
import { GeoLocationService } from 'src/app/services/geolocation-service/geo-location.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { FriendsFinderService } from 'src/app/services/friends-finder-service/friends-finder.service';
import { Geoposition } from '@ionic-native/geolocation/ngx';
import { AnalyticsService } from 'src/app/services/analytics-service/analytics.service';

@Component({
  selector: 'app-rankings',
  templateUrl: 'rankings.page.html',
  styleUrls: ['rankings.page.scss']
})
export class RankingsPage {

  public geoposition : Geoposition
  public listAllNearby : Array<any> = new Array()
  public nearbySelected : Array<any> = new Array()
  public globalSelected: Array<any> = new Array()
  public myMostTop 
  public user


  constructor(public share: SharingService,
    private geoSrv : GeoLocationService,
    private userSrv : UserService,
    private analytics: AnalyticsService,
    private friendsSrv : FriendsFinderService) {}
  
  async ionViewWillEnter(){
  
    this.selectList("nearby")

  }

  


  private async searchFirstUserOccurrence(listNearby : Array<any>){
    let myself = await this.userSrv.getUserLoggedIn();
    for(let checkin of listNearby){
      if(myself.username in checkin["usersDict"]){
        return checkin
      }
    }

    return null;

  }
  
  
  //Change the list that you're looking at
  view_list:String = "nearby" //default
  active_list:any = this.nearbySelected //default to nearby
  async selectList(name:String){
    this.analytics.logEvent("Ranking "+name+" selected")
    this.view_list = name
    if (this.view_list == "nearby") {
      await this.getNearbyInformation();
      this.active_list = this.nearbySelected
    } else {
      this.active_list = this.globalSelected
    }
  }



  private async getNearbyInformation(){
    this.analytics.logEvent("Opened Ranking Page")
    this.user = await this.userSrv.getUserLoggedIn()
    this.geoposition = await this.geoSrv.getActualPosition();
    
    console.log(this.geoposition)
    let listNearby = await this.friendsSrv.getNearbyRankingStreaks(this.geoposition)

    this.listAllNearby = listNearby;

    console.log(this.listAllNearby);

    let myData = this.searchFirstUserOccurrence(this.listAllNearby);

    this.nearbySelected = listNearby.slice(0,3)

    if(myData && myData["position"] > 4){
      this.nearbySelected.push(myData);
    }

  }


  



}
