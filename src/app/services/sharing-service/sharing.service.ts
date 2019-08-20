import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Injectable({
  providedIn: 'root'
})
export class SharingService {

  constructor(private socialSharing: SocialSharing) { }


  public async shareThisApp(){
    let options = {
      message: "I'm using BFF Streaks and it'd nice if you did too :) We can start a streak and climb the local or even the global BFF Rankings!", // not supported on some apps (Facebook, Instagram)
      subject: 'BFF Streaks', // fi. for email
      url: 'https://www.website.com/foo/#bar?a=b',
    };
    
    try {
      await this.socialSharing.shareWithOptions(options)
    } 
    catch (error) {
      console.log("Error while sharing app")
    }
    


  }


}
