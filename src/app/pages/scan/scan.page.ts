import { Component } from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FriendsFinderService } from '../../services/friends-finder-service/friends-finder.service';
import { UserBFF } from '../../types/User';
import { SharingService } from '../../services/sharing-service/sharing.service';
import { AnalyticsService } from 'src/app/services/analytics-service/analytics.service';

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
  mailboxInfo : Object

  constructor(
    private toastController: ToastController,
    private friendsFinder: FriendsFinderService,
    private platform: Platform,
    private analytics: AnalyticsService,
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
    this.analytics.logEvent("Opened Scan Page")
    this.usersNearbyObs =  await this.friendsFinder.startSearchingPeople()
    this.mailbox = await this.friendsFinder.getHandshakes()
    this.usersNearbyObs.subscribe(data => this.handleNearbyList(data))
    this.mailbox.subscribe((mail) => this.saveMailboxLocal(mail))
  }


  private saveMailboxLocal(mail){
    this.mailboxInfo = mail
    this.handleMailbox(this.mailboxInfo)
  }

  private handleMailbox(mail){
    
    if(!this.usersNearby)
      return
      
    if(!mail)
      return
    
    for(let user of this.usersNearby){
      if(user.username in mail){
        user.waiting = true
      }
      else
      {
        user.waiting = false
      }
    }  
  }

  handleNearbyList(list){
    console.log("handling list of nearby users...")
    console.log(list)
    this.usersNearbyLoaded = true
    this.usersNearby = list
    this.handleMailbox(this.mailboxInfo)
  }
  

  //stop scanning for people
  async ionViewWillLeave(){
    console.log("Leaving scanning page...")
    this.friendsFinder.stopSearchingPeople()
  }


  //when you tap a user
  public async tappedUser(user : UserBFF){
    this.analytics.logEvent("Tapped User on Scan Page")

    if(!this.mailbox){
      this.usersNearby = []
      return
    }

    if(user.username in this.mailboxInfo){
      if(user.waiting == true){
        this.analytics.logEvent("Tapped User that was waiting on Scan Page")
        this.friendsFinder.responseHandshake(user)
        const toast = await this.toastController.create({
          message: 'You checked in with '+user.username,
          duration: 800,
          position: "top",
          mode: "ios"
        });
        toast.present();
      }
    }
    else{
      let canHanshake = await this.friendsFinder.canHandShake(user.username)
      console.log("Here can handshake")
      console.log(canHanshake)
      if(!canHanshake){
        this.analytics.logEvent("Tapped User that was already checked in on Scan Page")
        const toast = await this.toastController.create({
          message: 'You can only check in with a friend every 24 hours!',
          duration: 800,
          position: "top",
          mode: "ios"
        });
        toast.present();
        return
      }
      
      this.friendsFinder.handShakeUser(user.username)
      this.analytics.logEvent("Initiated checkin on scan page with user")
      console.log("The following user was handshaked : ")
      console.log(user)
      const toast = await this.toastController.create({
        message: user.username+" now needs to check in with you",
        duration: 800,
        position: "top",
        mode: "ios"
      });
      toast.present();
    }

  }

  

}
