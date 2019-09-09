import { MeetRequest } from './MeetRequest';

export interface UserBFF{
    username : string,
    profilePicture : string
    mailBox? : Map<string,string> | Object

}