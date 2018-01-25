import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Resolve } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';


 import { DataService } from './../data/data.service';
 import { Expedient } from './../model/expedient.model';
 import { findParam } from './find-param';

@Injectable()
export class ExpedientResolverService /*implements Resolve<Expedient>*/ {

  constructor(private dataService: DataService) { }

  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> {
  //   console.log(route);
  //   const expedientId = findParam('expedient', route);
  //   return this.dataService.expedients().findById(expedientId);
  // }

}
