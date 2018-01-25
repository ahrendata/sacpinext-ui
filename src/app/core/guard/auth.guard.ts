import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {       
        if (localStorage.getItem('sacpiuser')) {            
            return true;
        }
        // not logged in so redirect to login page
        this.router.navigate(['/sacpi/login'], { queryParams: { returnUrl: state.url }});
        //this.router.navigate(['/sacpi/login']);
        return false;
    }
}