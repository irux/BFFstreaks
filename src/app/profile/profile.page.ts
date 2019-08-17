import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  constructor(private userSrv : UserService) {}



  public async register(){
    console.log("Hello")
    let image = await this.userSrv.takePictureGallery()
    let linkUpload  = await this.userSrv.uploadPhotoUser(image)
    let userObject = await this.userSrv.register("irux",linkUpload)
    console.log(userObject)
  }
  

}
