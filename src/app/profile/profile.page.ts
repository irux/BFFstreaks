import { Component } from '@angular/core';
import { UserService } from '../services/user-service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  constructor(private userSrv : UserService) {}



  public async register(){
    console.log("Hello")
    let isLoggedIn = await this.userSrv.getUserLoggedIn()
    console.log(isLoggedIn)

  }
  

}
