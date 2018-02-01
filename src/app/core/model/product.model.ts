import { Model } from './model';
import { Observable } from 'rxjs/Observable';
import { RestangularService } from './../data/restangular.service';
import { URLSearchParams } from '@angular/http';

export class Product extends Model {
  
  build(): Product {
    return new Product(this.restangular);
  }

  IdProducto: number;

  constructor(restangular: RestangularService) {
    super(restangular);
  } 
}