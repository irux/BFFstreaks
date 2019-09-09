import { Component, OnInit } from '@angular/core';
import { UserBFF } from '../../types/User';
import { UserService } from '../../services/user-service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private userSrv: UserService,private router: Router) { }

  //get the user when you log in
  async ngOnInit(){
    this.user = await this.userSrv.getUserLoggedIn()
  }


  //user
  user:UserBFF

  //delete account function
  async deleteAccount(){
    this.userSrv.loggout()
    this.router.navigate(['/login'])
  }

}
