import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AnalyticsService } from '../analytics-service/analytics.service';
import { UserService } from '../user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class SharingService {
  constructor(private socialSharing: SocialSharing, private userSrv: UserService, private analytics: AnalyticsService) { 
   }


  public async shareThisApp(page){
    let user = await this.userSrv.getUserLoggedIn()
    await this.analytics.logEvent("Share App clicked")
    await this.analytics.logEvent("Share App clicked on page: "+page)
    let options = {
      message: "I'm using BFF Streaks and it'd be nice if you did too :) We can start a streak and climb the local or even the global BFF Rankings!", // not supported on some apps (Facebook, Instagram)
      subject: 'BFF Streaks', // fi. for email
      url: 'https://bffstreaks.appchama.com/invite.html?invitedBy='+user.username,
    };
    
    try {
      await this.socialSharing.shareWithOptions(options)
    } 
    catch (error) {
      console.log("Error while sharing app")
      console.log(error)
    }
    


  }


}
