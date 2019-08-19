import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user-service/user.service';

@Injectable({
 providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private userSrv: UserService,
    private router: Router
      ) {}

  async canActivate(
   next: ActivatedRouteSnapshot,
   state: RouterStateSnapshot) //:Observable<boolean> | Promise<boolean> | boolean
      {
        let loggedIn:boolean = await this.userSrv.isLogIn()
          if(loggedIn){
            return loggedIn
          }
          else{
            //if not logged in redirect to login
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            return loggedIn
          }
      }
}