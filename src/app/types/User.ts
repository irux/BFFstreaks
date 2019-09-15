import { MeetRequest } from './MeetRequest';

export interface UserBFF{
    username : string,
    profilePicture : string
    mailbox? : Map<string,string> | Object
    waiting? : boolean
}