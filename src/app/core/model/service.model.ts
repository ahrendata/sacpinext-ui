
import { Model } from './model';
import { Observable } from 'rxjs/Observable';
import { RestangularService } from './../data/restangular.service';
import { URLSearchParams } from '@angular/http';

export class Services extends Model {
  
  build(): Services {
    return new Services(this.restangular);
  }

  IdExpediente: number;

  constructor(restangular: RestangularService) {
    super(restangular);
  } 
}