import { MeetRequest } from './MeetRequest';

export interface UserBFF{
    username : string,
    profilePicture : string
    requestMeets? : Map<string,MeetRequest>
}