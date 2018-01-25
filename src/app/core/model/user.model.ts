
import { Model } from './model';
import { Observable } from 'rxjs/Observable';
import { RestangularService } from './../data/restangular.service';
import { URLSearchParams } from '@angular/http';

export class User extends Model {
  
  build(): User {
    return new User(this.restangular);
  }

  IdUsuario: number;

  constructor(restangular: RestangularService) {
    super(restangular);
  } 
}