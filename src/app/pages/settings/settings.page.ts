import { Component, OnInit } from '@angular/core';
import { UserBFF } from '../../types/User';
import { UserService } from '../../services/user-service/user.service';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics-service/analytics.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private userSrv: UserService,
    private analytics: AnalyticsService,
    private router: Router) { }

  //get the user when you log in
  async ngOnInit(){
    await this.analytics.logEvent("Opened Settings page")
    await this.analytics.setScreenFirebase("SettingsPage")
    this.user = await this.userSrv.getUserLoggedIn()
  }


  //user
  user:UserBFF

  //delete account function
  async deleteAccount(){
    await this.analytics.logEvent("Clicked Delete account in Settings page")
    this.userSrv.loggout()
    this.router.navigate(['/login'])
  }

}
