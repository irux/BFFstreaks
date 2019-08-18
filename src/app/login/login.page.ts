import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  //error with the nickname
  nickname_taken = true

  constructor(private router: Router) { }

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
    allowTouchMove: false
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
}
