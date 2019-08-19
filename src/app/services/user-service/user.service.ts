import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserBFF } from '../../types/User';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subscription, BehaviorSubject, Subject } from 'rxjs';
import { MeetRequest } from 'src/app/types/MeetRequest';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  private STORAGE_PHONE_LOCATION = "users2"

  private STORAGE_FIREBASE_LOCATION = "users"
  public requestSubscription: Subscription
  public meetObservable: Subject<MeetRequest>



  constructor(
    private storage: Storage,
    private db: AngularFirestore,
    private camera: Camera,
    private storageFirebase: AngularFireStorage) { }


  /**
   * Get the actual user logged in. It search on the local storage of the device.
   * 
   * @returns Returns the user saved after log in.
   */
  public async getUserLoggedIn(): Promise<UserBFF> {
    let existsUser = await this.isLogIn()
    if (!existsUser) {
      throw new Error("The device is not logged in!")
    }
    let user = await this.storage.get(this.STORAGE_PHONE_LOCATION)
    return user
  }

  public async loggout() {
    let promise = await this.storage.remove(this.STORAGE_PHONE_LOCATION)
  }

  private makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  private proccessRequests(userProfile: UserBFF) {
    if (userProfile.requestMeets === null || userProfile.requestMeets === undefined)
      return;
    this.meetObservable.next(userProfile.requestMeets)
  }

  public async listenToMeetRequest(): Promise<Observable<MeetRequest>> {

    if (this.meetObservable === null || this.meetObservable === undefined) {
      this.meetObservable = new Subject();
    }
    let loggedin = await this.isLogIn()
    if (!loggedin) {
      throw new Error("The user is not logged in")
    }
    let user = await this.getUserLoggedIn();
    let myUserObservable = this.db.collection(this.STORAGE_FIREBASE_LOCATION).doc(user.username).valueChanges()
    this.requestSubscription = myUserObservable.subscribe((userProfile: UserBFF) => this.proccessRequests(userProfile))
    return this.meetObservable
  }


  public stopListenToRequest(): void {

    if (this.meetObservable === null || this.meetObservable === undefined) {
      throw new Error("The listener was not activated!")
    }

    if (this.requestSubscription === null || this.requestSubscription === undefined) {
      throw new Error("Something went wrong with the unsubscription")
    }

    this.requestSubscription.unsubscribe()
    this.meetObservable.complete()
    this.meetObservable = null
    
  }

  /**
   * The function returns if the user is already log in
   * 
   * @returns true if your are log in, otherwise false
   */
  public async isLogIn(): Promise<boolean> {
    let user = await this.storage.get(this.STORAGE_PHONE_LOCATION)
    if (user === null) {
      return false;
    }
    return true;
  }


  private getConfigCamera(openType: number): CameraOptions {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: openType,
    } as CameraOptions
    return options
  }

  /**
   * This method take a picture from the gallery and then it gets the photo as a base64 string.
   * 
   * @returns base64 representation of the photo.
   */
  public async takePictureGallery(): Promise<string> {
    try {
      let configCameraPicture = this.getConfigCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
      let picture = await this.camera.getPicture(configCameraPicture)
      return picture
    }
    catch (e) {
      throw new Error("Something went wrong choosing picture from gallery! :  " + e)
    }
  }

  /**
   * This method take a picture with the camera and then it gets the photo as a base64 string.
   * 
   * @returns base64 representation of the photo.
   */
  public async takePictureCamera(): Promise<string> {
    try {
      let configCameraPicture = this.getConfigCamera(this.camera.PictureSourceType.CAMERA);
      let picture = await this.camera.getPicture(configCameraPicture)
      return picture;
    }
    catch (e) {
      throw new Error("Something went wrong taking the picture! :  " + e)
    }
  }



  /**
   * This method uploads an image with a base64 representation.
   * 
   * @param base64Repr The representation of the image in base64
   * 
   * @returns This method returns the url where the image was upload
   */
  public async uploadPhotoUser(base64Repr: string): Promise<string> {
    if(base64Repr === null || base64Repr === undefined)
    {
      throw new Error("The photo information can't be null or undefined")
    }
    const id = this.makeid(20)
    let reference = this.storageFirebase.ref(`${this.STORAGE_FIREBASE_LOCATION}/${id}`)
    let task = reference.putString(base64Repr, "base64", { contentType: 'image/jpeg' })

    let promise = new Promise<string>((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(() => reference.getDownloadURL().subscribe((url: string) => resolve(url)))
      )
        .subscribe()
    })

    return promise

  }

  /**
   * This method register a user on the DB
   * 
   * @param username The username that the user choose at the beginnig
   * 
   * @returns returns the userObject if the process was successful
   */
  public async register(username: string, profilePicture: string): Promise<UserBFF> {

    let exists = await this.userExists(username);

    if (exists) {
      throw new Error("User Already Exists")
    }

    let user = this.createUsernameObject(username, profilePicture)

    await this.db.collection(this.STORAGE_FIREBASE_LOCATION).doc(username).set(user)

    await this.saveUserOnPhone(user)

    return user
  }

  private async saveUserOnPhone(user: UserBFF) {
    let saved = await this.storage.set(this.STORAGE_PHONE_LOCATION, user)
    return true
  }



  /**
   * This method search on the DB if the given username already exists
   * 
   * 
   * @param username Userame to search on DB.
   * 
   * @returns True if the user exists, otherwise false
   */
  public async userExists(username: string): Promise<boolean> {

    let user = new Promise<boolean>((resolve, reject) => {

      let userObservable = this.db.collection(this.STORAGE_FIREBASE_LOCATION).doc(username).get()
      userObservable.subscribe((user) => {
        if (user.exists) {
          resolve(true)
        }
        else {
          resolve(false)
        }
      })

    })

    return user

  }


  private createUsernameObject(username: string, profilePicture: string): UserBFF {
    return {
      username: username,
      profilePicture: profilePicture
    }
  }


}
