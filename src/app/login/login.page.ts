import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { UserService } from '../services/user-service/user.service';
import { ActionSheetController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { FormsModule } from "@angular/forms";
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  //error with the nickname
  @ViewChild('sliderRef', { static: true }) protected slides: IonSlides;
  public nickname_taken : boolean = false ;
  public nickname : string;
  private photoLink : string
  private backButtonSubscription : Subscription

  constructor(private router: Router,
     private platformSrv : Platform,
     private userSrv : UserService,
     private actionSheetController: ActionSheetController ) { }

  ngOnInit() {
    this.backButtonSubscription = this.platformSrv.backButton.subscribe(async () => await this.backButtonOverride())
  }

  private async backButtonOverride(){
    console.log("Button clicked")
    let end = await this.slides.isEnd()
    console.log(end)
    if(!end){
      await this.slides.slidePrev()
    }
    else{
      this.backButtonSubscription.unsubscribe()
    }
  }

  async navTabs(){
    //you can use either of below
    this.router.navigate(['/app'])
    //remove back button
  }

  // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
  slideOpts = {
    initialSlide: 0,
    speed: 300,
    allowTouchMove: false,
    autoHeight: true
  };

  
  async slideNext(): Promise<void> {
    await this.slides.slideNext()
  }


  

  public async photoFormOption(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [{
        
        text: 'Upload Photo From Gallery',
        role: 'destructive',
        handler: async () : Promise<boolean> => {
          try{
            let dataPhoto = await this.userSrv.takePictureGallery()
            await this.actionSheetController.dismiss()
            await this.slideNext()
            this.photoLink = await this.userSrv.uploadPhotoUser(dataPhoto)
            await this.register();
            this.finished = true
          }
          catch(e){
            console.log("Something went wrong")
            console.log(e)
          }
          return true;
        }
      }, {
        text: 'Take Picture With Camera',
        handler: async () : Promise<boolean> => {
          try{
            let dataPhoto = await this.userSrv.takePictureCamera()
            await this.actionSheetController.dismiss()
            await this.slideNext()
            this.photoLink = await this.userSrv.uploadPhotoUser(dataPhoto)
            await this.register();
            this.finished = true
          }
          catch(e){
            console.log("Something went wrong")
            console.log(e)
          }
          return true;
        }
      }]
    });
    await actionSheet.present();
  }



  /**
   * Test if user is taken. If it is not taken, it goes to the next slide. Otherwise,
   * it tells you to choose other username.
   */
  public async testUserRegister(){
    this.nickname_taken = false
    let exists = await this.userSrv.userExists(this.nickname.toLowerCase())
    if(exists){
      this.nickname_taken = true
      return
    }
    await this.slideNext()
  }

  public async register(){

    let user = await this.userSrv.register(this.nickname,this.photoLink)

    console.log("Welcome user : " + user.username)

  }


  //profile picutres
  pictures = [
    "https://picsum.photos/200",
    "https://picsum.photos/201",
    "https://picsum.photos/202",
    "https://picsum.photos/203",
    "https://picsum.photos/204",
    "https://picsum.photos/205",
    "https://picsum.photos/206",
    "https://picsum.photos/207",
    "https://picsum.photos/208",
    "https://picsum.photos/209",
    "https://picsum.photos/210",
    "https://picsum.photos/211",
  ]


  //variable to see if you're finished and ready to leave
  finished:boolean = false
  


}
