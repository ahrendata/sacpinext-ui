import { Model } from './model';
import { Observable } from 'rxjs/Observable';
import { RestangularService } from './../data/restangular.service';
import { URLSearchParams } from '@angular/http';

export class ContainerTypeCode extends Model {
  
  build(): ContainerTypeCode {
    return new ContainerTypeCode(this.restangular);
  }

  IdContenedor: number;

  constructor(restangular: RestangularService) {
    super(restangular);
  } 
}