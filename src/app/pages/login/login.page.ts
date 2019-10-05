import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { UserService } from '../../services/user-service/user.service';
import { ActionSheetController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { FormsModule } from "@angular/forms";
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Subscription } from 'rxjs';
import { AnalyticsService } from 'src/app/services/analytics-service/analytics.service';

enum PhotoSource {
  CAMERA,
  GALLERY,
  LIST_PHOTOS
}


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  //error with the nickname
  @ViewChild('sliderRef', { static: true }) protected slides: IonSlides;
  public PhotoSource = PhotoSource
  public nickname_taken: boolean = false;
  public nickname: string;
  private photoLink: string
  private backButtonSubscription: Subscription
  private selectedLink : string

  constructor(private router: Router,
    private platformSrv: Platform,
    private userSrv: UserService,
    private analytics: AnalyticsService,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.backButtonSubscription = this.platformSrv.backButton.subscribe(async () => await this.backButtonOverride())
    this.analytics.logEvent("Opened Login Page")
  }

  private async backButtonOverride() {
    console.log("Button clicked")
    let end = await this.slides.isEnd()
    console.log(end)

    if (!end) {
      await this.slides.slidePrev()
    }
    else {
      this.backButtonSubscription.unsubscribe()
    }
  }

  async navTabs() {
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



  public selectImageFromList(index : number){
    this.selectedLink = this.pictures[index]
  }

  public async photoFormOption() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [{

        text: 'Upload photo from gallery',
        role: 'destructive',
        handler: async (): Promise<boolean> => {
          try {
            await this.registerRequirements(PhotoSource.GALLERY);

          }
          catch (e) {
            console.log("Something went wrong uploading from the gallery")
            console.log(e)
          }
          return true;
        }
      }, {
        text: 'Take picture with camera',
        handler: async (): Promise<boolean> => {
          try {
            await this.registerRequirements(PhotoSource.CAMERA);
          }
          catch (e) {
            console.log("Something went wrong uploading from the phone")
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
  public async testUserRegister() {
    //if there is a nickname
    if(this.nickname && this.nickname.length > 3){
      this.nickname_taken = false
      let exists = await this.userSrv.userExists(this.nickname.toLowerCase())
      if (exists) {
        this.nickname_taken = true
        return
      }
      await this.slideNext()
    }
    else{
      //tell the user that the username is too short
      const toast = await this.toastController.create({
        message: 'Please choose a longer nickname',
        duration: 1500,
        position: "bottom",
        mode: "ios"
      });
      toast.present();
    }
    
  }

  public async registerRequirements(sourcePhoto: PhotoSource){
    try{
      let dataPhoto = undefined
      if (sourcePhoto === PhotoSource.CAMERA) {
        dataPhoto = await this.userSrv.takePictureCamera()
        this.photoLink = await this.userSrv.uploadPhotoUser(dataPhoto)
        await this.actionSheetController.dismiss()
      } else if (sourcePhoto === PhotoSource.GALLERY) {
        dataPhoto = await this.userSrv.takePictureGallery()
        this.photoLink = await this.userSrv.uploadPhotoUser(dataPhoto)
        await this.actionSheetController.dismiss()
      } else if (sourcePhoto === PhotoSource.LIST_PHOTOS) {
        this.photoLink = this.selectedLink
      }
      this.register(this.nickname,this.photoLink)
    }
    catch(e){
      console.log("Something went wrong : " + e)
    }
    

    
  }

  public async register(user: string , link : string) {

    try {
      await this.slideNext()
      let user = await this.userSrv.register(this.nickname, this.photoLink)
      this.finished = true
    }
    catch (e) {
      console.log("Something went wrong with registration : " + e)
    }


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
  finished: boolean = false



}
