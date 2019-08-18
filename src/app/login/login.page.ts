import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { FormsModule } from "@angular/forms";
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //input object
  user_info = {
    nickname:null,
    photo:""
  }

  constructor(private router: Router) {
   }

  ngOnInit() {
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

  @ViewChild('sliderRef', { static: true }) protected slides: IonSlides;
  async slideNext(): Promise<void> {
    //go to next slide
    await this.slides.slideNext()
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
