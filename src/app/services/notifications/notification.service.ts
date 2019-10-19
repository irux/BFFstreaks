import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user-service/user.service';
import * as firebase from "firebase/app"
import { Subscription } from 'rxjs';
import { UserAgent } from '@sentry/browser/dist/integrations';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private refreshSubscription: Subscription
  private handlerNotificationSubscription: Subscription

  constructor(private firebaseX: FirebaseX, private firestore: AngularFirestore, private userSrv: UserService) {

    this.setupNotifications()

  }


  private setupNotifications() {
    this.handlerNotificationSubscription = this.firebaseX.onMessageReceived().subscribe(
      (message) => {
        if (message.messageType === "notification") {
          console.log("Notification message received");
          if (message.tap) {
            console.log("Tapped in " + message.tap);
          }
        }
        if (message.messageType === "data") {
          console.log("Notification message received");
          if (message.tap) {
            console.log("Tapped in " + message.tap);
          }
        }
      }
    )
  }



  public registerDeviceOnTopic(topic: string) {
    this.firebaseX.subscribe(topic);
  }

  private saveTokenFirebaseFromUser(token: string, username: string) {
    this.firestore.collection("tokens").doc(username).set({
      token_devices: token,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  public async initTokenNotifications() {

    let myself = await this.userSrv.getUserLoggedIn()

    let token = await this.firebaseX.getToken()

    if (token !== null) {
      this.saveTokenFirebaseFromUser(token, myself.username);
    }

  }


  public activateOnRefreshToken() {
    this.refreshSubscription = this.firebaseX.onTokenRefresh().subscribe(
      async token => await this.refreshTokenStrategy(token))
  }
  private async refreshTokenStrategy(token: string) {
    let myself = await this.userSrv.getUserLoggedIn()
    if (token !== null) {
      this.saveTokenFirebaseFromUser(token, myself.username);
    }
  }


}
