import { Injectable } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { environment } from '../../../environments/environment'
import { FirebaseX } from "@ionic-native/firebase-x/ngx";



@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private fb: Facebook, private firebaseAnalytics: FirebaseX) {

  }

  private isProduction() {
    return environment.production;
  }

  async logEvent(event): Promise<void> {
    if (!this.isProduction())
      return

    this.fb.logEvent(event);
    await this.firebaseAnalytics.logEvent(event, { name: event });
  }

  async setUserIDFirebase(user: string) {
    if (!this.isProduction())
      return

    await this.firebaseAnalytics.setUserId(user);
  }


  async enabledAnalyticsFirebase(enable: boolean) {

    await this.firebaseAnalytics.setAnalyticsCollectionEnabled(enable);

  }

  async setScreenFirebase(screen: string) {
    if(!this.isProduction())
      return

    await this.firebaseAnalytics.setScreenName(screen);
  }

}
