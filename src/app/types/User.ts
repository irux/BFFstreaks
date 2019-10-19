import { MeetRequest } from './MeetRequest';
import * as firebase from "firebase/app"
export interface UserBFF{
    username : string,
    profilePicture : string
    mailbox? : Map<string,string> | Object
    waiting? : boolean,
    timestamp? : firebase.firestore.FieldValue
}