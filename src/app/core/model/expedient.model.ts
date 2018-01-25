
import { Model } from './model';
import { Observable } from 'rxjs/Observable';
import { RestangularService } from './../data/restangular.service';
import { URLSearchParams } from '@angular/http';

export class Expedient extends Model {
  
  build(): Expedient {
    return new Expedient(this.restangular);
  }

  IdExpediente: number;

  constructor(restangular: RestangularService) {
    super(restangular);
  } 
}