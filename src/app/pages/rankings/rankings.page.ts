import { Component } from '@angular/core';
import { SharingService } from '../../services/sharing-service/sharing.service';
import { GeoLocationService } from 'src/app/services/geolocation-service/geo-location.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { FriendsFinderService } from 'src/app/services/friends-finder-service/friends-finder.service';
import { Geoposition } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-rankings',
  templateUrl: 'rankings.page.html',
  styleUrls: ['rankings.page.scss']
})
export class RankingsPage {

  public geoposition : Geoposition
  public listAllNearby : Array<any> = new Array()
  public nearbySelected : Array<any> = new Array()
  public myMostTop 

  constructor(public share: SharingService,private geoSrv : GeoLocationService,private userSrv : UserService,private friendsSrv : FriendsFinderService) {}
  
  //rankings object
  rankings:{nearby,global,your_best} = {
    nearby:{
      streaks : [
        {
          users:[
            {
              nickname: "vicky133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            },
            {
              nickname: "v12133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            }
          ],
          streak:true,
          streak_count:21,
          hours_left:20,
          last_met:1
        },
        {
          users:[
            {
              nickname: "vicky133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            },
            {
              nickname: "v12133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            }
          ],streak:true,
          streak_count:12,
          hours_left:12,
          last_met:1
        },
        {
          users:[
            {
              nickname: "vicky133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            },
            {
              nickname: "v12133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            }
          ],streak:true,
          streak_count:9,
          hours_left:3,
          last_met:1
        }
      ],
      all : [
        {
          users:[
            {
              nickname: "vicky133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            },
            {
              nickname: "v12133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            }
          ],longest_streak:1,
          total_count:30
        },
        {
          users:[
            {
              nickname: "vicky133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            },
            {
              nickname: "v12133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            }
          ],longest_streak:10,
          total_count:10
        },
        {
          users:[
            {
              nickname: "vicky133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            },
            {
              nickname: "v12133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            }
          ],longest_streak:3,
          total_count:8
        }
      ]
    },
    global : {
      streaks : [
        {
          users:[
            {
              nickname: "vicky133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            },
            {
              nickname: "v12133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            }
          ],streak:true,
          streak_count:121,
          hours_left:20,
          last_met:1
        },
        {
          users:[
            {
              nickname: "vicky133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            },
            {
              nickname: "v12133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            }
          ],streak:true,
          streak_count:112,
          hours_left:12,
          last_met:1
        },
        {
          users:[
            {
              nickname: "vicky133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            },
            {
              nickname: "v12133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            }
          ],streak:true,
          streak_count:19,
          hours_left:3,
          last_met:1
        }
      ],
      all : [
        {
          users:[
            {
              nickname: "vicky133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            },
            {
              nickname: "v12133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            }
          ],longest_streak:1,
          total_count:30
        },
        {
          users:[
            {
              nickname: "vicky133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            },
            {
              nickname: "v12133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            }
          ],longest_streak:10,
          total_count:10
        },
        {
          users:[
            {
              nickname: "vicky133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            },
            {
              nickname: "v12133",
              avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
            }
          ],
          longest_streak:3,
          total_count:8
        }
      ]
    },
    your_best:{
      all: {
        global_rank:92,
        nearby_rank:49,
        longest_streak:1,
        total_count:2,
        friend:{
          nickname:"alejo96",
          avatar:"https://www.telegraph.co.uk/content/dam/news/2017/05/26/ben-and-jerry_trans_NvBQzQNjv4BqqVzuuqpFlyLIwiB6NTmJwfSVWeZ_vEN7c6bHu2jJnT8.jpg?imwidth=1400"
        }
      },
      streaks:{
        friend:{
          nickname: "vicky133",
          atar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
        },
        streak:true,
        streak_count:4,
        hours_left:20,
        last_met:1,
        global_rank:122,
        nearby_rank:99,
      }
    }
  }


  async ngOnInit(){
    let realtimeObservable = await this.geoSrv.listenRealTimeLocation()
    let firstPositionGetted = await realtimeObservable.toPromise()
    this.geoposition = firstPositionGetted
    let listNearby = await this.friendsSrv.getNearbyRankingStreaks(this.geoposition)
    this.listAllNearby = listNearby;
    this.nearbySelected = listNearby.slice(0,3)
    
  }

  private async searchFirstUserOccurrence(listNearby : Array<any>){
    let myself = await this.userSrv.getUserLoggedIn();
    for(let checkin in listNearby){
      if(myself.username in checkin["users"]){
        return checkin
      }
    }

    return null;

  }
  
  //Change the list that you're looking at
  view_list:String = "nearby" //default
  active_list:any = this.nearbySelected //default to nearby
  selectList(name:String){
    this.view_list = name
    if (this.view_list == "nearby") {
      this.active_list = this.nearbySelected
    } else {
      this.active_list = this.rankings.global
    }
  }

  //user object
  user = {
    nickname: "username",
    avatar: "https://www.telegraph.co.uk/content/dam/news/2017/05/26/ben-and-jerry_trans_NvBQzQNjv4BqqVzuuqpFlyLIwiB6NTmJwfSVWeZ_vEN7c6bHu2jJnT8.jpg?imwidth=1400"
  }

  



}
