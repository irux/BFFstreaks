import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FriendsFinderService } from '../services/friends-finder-service/friends-finder.service';
import { UserBFF } from '../types/User';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss']
})
export class ScanPage {

  constructor(
    private toastController: ToastController,
    private friendsFinder: FriendsFinderService
    ) {}

  //start scanning for people
  async ionViewWillEnter(){
    console.log("Entering scanning page...")
    this.usersNearbyObs =  await this.friendsFinder.startSearchingPeople()
    this.usersNearbyObs.subscribe(data => this.handleNearbyList(data))
  }
  handleNearbyList(list){
    console.log("handling list...")
    this.usersNearby = list
    console.log(this.usersNearby)
  }
  usersNearbyObs
  usersNearby:Array<UserBFF>

  //stop scanning for people
  async ionViewWillLeave(){
    console.log("Leaving scanning page...")
    this.friendsFinder.stopSearchingPeople()
  }


  //when you tap a user
  async tappedUser(nickname, checkedIn, waiting){
    if (checkedIn) {
      const toast = await this.toastController.create({
        message: 'You can only check in with a friend every 24 hours!',
        duration: 800,
        position: "bottom",
        mode: "ios"
      });
      toast.present();
    }
    else if (waiting){
      const toast = await this.toastController.create({
        message: 'You checked in with '+nickname,
        duration: 800,
        position: "bottom",
        mode: "ios"
      });
      toast.present();
    }
    else {
      const toast = await this.toastController.create({
        message: nickname+" now needs to check in with you",
        duration: 800,
        position: "bottom",
        mode: "ios"
      });
      toast.present();
    }
  }

  people_nearby = [
    {
      nickname: "vicky133",
      avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    },
    {
      nickname: "vicky133",
      avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:false,
      checkedIn:false
    },
    {
      nickname: "vicky133",
      avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:false,
      checkedIn:true
    },
    {
      nickname: "vicky133",
      avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    },
    {
      nickname: "vicky133",
      avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    },
    {
      nickname: "vicky133",
      avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    },
    {
      nickname: "vicky133",
      avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    }
  ]

}
