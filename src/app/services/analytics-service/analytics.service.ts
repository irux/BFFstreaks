import { Injectable } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private fb: Facebook) { 

  }

  logEvent(name){
      this.fb.logEvent(name);
  }


}
