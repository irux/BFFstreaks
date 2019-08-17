import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss']
})
export class ScanPage {

  constructor(public toastController: ToastController) {}

  //when you tap a user
  async tappedUser(nickname, checkedIn, waiting){
    if (checkedIn) {
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
  }

  people_nearby = [
    {
      nickname: "vicky133",
      avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    },
    {
      nickname: "vicky133",
      avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:false,
      checkedIn:false
    },
    {
      nickname: "vicky133",
      avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:false,
      checkedIn:true
    },
    {
      nickname: "vicky133",
      avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    },
    {
      nickname: "vicky133",
      avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    },
    {
      nickname: "vicky133",
      avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    },
    {
      nickname: "vicky133",
      avatar:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==",
      waiting:true,
      checkedIn:false
    }
  ]

}
