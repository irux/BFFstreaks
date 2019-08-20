import { Component } from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';
import { FriendsFinderService } from '../services/friends-finder-service/friends-finder.service';
import { UserBFF } from '../types/User';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss']
})
export class ScanPage {

  constructor(
    private toastController: ToastController,
    private friendsFinder: FriendsFinderService,
    private platform: Platform
    ) {}

    //handle pausing of the app
  ngOnInit(){
    this.platform.pause.subscribe(()=>{
      try {
        console.log("pausing app so stopping search...")
        this.friendsFinder.stopSearchingPeople()
      } catch (error) {
        console.log(error)
      }
    })
    this.platform.resume.subscribe(()=>{
      try {
        console.log("starting app again so start searching again...")
        this.friendsFinder.startSearchingPeople()
      } catch (error) {
        console.log(error)
      }
    })
  } 

  //start scanning for people
  async ionViewWillEnter(){
    console.log("Entering scanning page...")
    this.usersNearbyObs =  await this.friendsFinder.startSearchingPeople()
    this.usersNearbyObs.subscribe(data => this.handleNearbyList(data))
  }
  handleNearbyList(list){
    console.log("handling list of nearby users...")
    
    this.people_nearby = list
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
      username: "vicky133",
      profilePicture:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    },
    {
      username: "vicky133",
      profilePicture:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:false,
      checkedIn:false
    },
    {
      username: "vicky133",
      profilePicture:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:false,
      checkedIn:true
    },
    {
      username: "vicky133",
      profilePicture:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    },
    {
      username: "vicky133",
      profilePicture:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    },
    {
      username: "vicky133",
      profilePicture:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    },
    {
      username: "vicky133",
      profilePicture:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    }
  ]

}
