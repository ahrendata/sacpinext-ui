import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from './token.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private token: TokenService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.token.getToken()) {
            return true;
        }                
        this.router.navigate(['/sacpi/login'], { queryParams: { returnUrl: state.url } });       
        return false;
    }
}