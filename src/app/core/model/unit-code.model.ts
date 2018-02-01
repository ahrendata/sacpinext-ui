import { Model } from './model';
import { Observable } from 'rxjs/Observable';
import { RestangularService } from './../data/restangular.service';
import { URLSearchParams } from '@angular/http';

export class UnitCode extends Model {
  
  build(): UnitCode {
    return new UnitCode(this.restangular);
  }

  IdContenedor: number;

  constructor(restangular: RestangularService) {
    super(restangular);
  } 
}