import { Component } from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FriendsFinderService } from '../../services/friends-finder-service/friends-finder.service';
import { UserBFF } from '../../types/User';
import { SharingService } from '../../services/sharing-service/sharing.service';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss']
})
export class ScanPage {

  usersNearbyLoaded:boolean = false
  usersNearbyObs
  usersNearby:Array<UserBFF>
  mailbox : Observable<any>

  constructor(
    private toastController: ToastController,
    private friendsFinder: FriendsFinderService,
    private platform: Platform,
    public share: SharingService,
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
    this.mailbox = await this.friendsFinder.getHandshakes()
    console.log("Hello")
    this.usersNearbyObs.subscribe(data => this.handleNearbyList(data))
    this.mailbox.subscribe((mail) => this.handleMailbox(mail))
    
  }

  private handleMailbox(mail){

    for(let user of this.usersNearby){
      if(user.username in mail){
        user.waiting = true
      }
    }  
  }

  handleNearbyList(list){
    console.log("handling list of nearby users...")
    console.log(list)
    this.usersNearbyLoaded = true
    this.usersNearby = list
  }
  

  //stop scanning for people
  async ionViewWillLeave(){
    console.log("Leaving scanning page...")
    this.friendsFinder.stopSearchingPeople()
  }


  //when you tap a user
  public async tappedUser(user : UserBFF){
    
   await this.friendsFinder.handShakeUser(user.username)
   console.log("The following user was handshaked : ")
   console.log(user)
    /*
    if (user) {
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
    */
  }

  

}

}
