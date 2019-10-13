import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AngularFireStorageModule } from '@angular/fire/storage';

import { IonicStorageModule } from '@ionic/storage';

import { Camera } from '@ionic-native/camera/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as Sentry from 'sentry-cordova';
Sentry.init({ dsn: 'https://5fb01216d49f4a01971258347e475fd4@sentry.io/1709423' });
import { ErrorHandler } from '@angular/core';
import {  SentryIonicErrorHandler } from "../app/sentry-config"
import { Facebook } from '@ionic-native/facebook/ngx';
import { FirebaseX } from "@ionic-native/firebase-x/ngx";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: ErrorHandler, useClass: environment.production ? SentryIonicErrorHandler : ErrorHandler },
    Camera,
    Geolocation,
    SocialSharing,
    FirebaseX
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
