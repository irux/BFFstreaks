import { Component } from '@angular/core';

@Component({
  selector: 'app-rankings',
  templateUrl: 'rankings.page.html',
  styleUrls: ['rankings.page.scss']
})
export class RankingsPage {

  constructor() {}
  
  //rankings object
  rankings:{nearby,global,your_best} = {
    nearby:{
      streaks : [
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
        }
      ],
      all : [
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
        }
      ]
    },
    global : {
      streaks : [
        {
          nickname: "vicky133",
          avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
          streak:true,
          streak_count:121,
          hours_left:20,
          last_met:1
        },
        {
          nickname: "alejo96",
          avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
          streak:true,
          streak_count:112,
          hours_left:12,
          last_met:1
        },
        {
          nickname: "beatrice",
          avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
          streak:true,
          streak_count:19,
          hours_left:3,
          last_met:1
        }
      ],
      all : [
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
  
  //Change the list that you're looking at
  view_list:String = "nearby" //default
  active_list:any = this.rankings.nearby //default to nearby
  selectList(name:String){
    this.view_list = name
    if (this.view_list == "nearby") {
      this.active_list = this.rankings.nearby
    } else {
      this.active_list = this.rankings.global
    }
  }




}
