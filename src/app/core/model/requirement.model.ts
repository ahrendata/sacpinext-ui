import { Headers, ResponseContentType, URLSearchParams } from '@angular/http';

import { Model } from './model';
import { Observable } from 'rxjs/Observable';
import { RestangularService } from './../data/restangular.service';

export class Requirement extends Model {

  id: string;
  requirementId: string;
  requirementType: string;
  enabled: boolean;
  createdTimestamp: Date;

  attributes: any;


  constructor(restangular: RestangularService) {
    super(restangular);
  }

  build(): Requirement {
    return new Requirement(this.restangular);
  }

  getJsonRepresentation(): Observable<any> {
    return this.restangular
      .all('representation/json')
      .get()
      .map(response => response.json());
  }

  reload() {
    return this.restangular.get()
      .map(response => Object.assign(new Requirement(this.restangular), <Requirement>response.json()));
  }  
  setId(id: string): Requirement {
    this.id = id;
    return this;
  }

  setRequirementId(requirementId: string): Requirement {
    this.requirementId = requirementId;
    return this;
  }

}
