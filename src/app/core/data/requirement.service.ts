
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Requirement } from './../model/requirement.model';
import { Expedient } from './../model/expedient.model';

import { SearchCriteria } from './../model/search-criteria.model';
import { SearchResults } from './../model/search-results.model';
import { URLSearchParams } from '@angular/http';
import { RestangularService } from './restangular.service';
const requirementIdName = 'Requirement';
const requirementsPath = 'Requirement';

@Injectable()
export class RequirementService {


  private restangular: RestangularService;
  constructor(restangular: RestangularService) {
    this.restangular = restangular.all(requirementsPath);
  }

  findById(expedient: Expedient, id: number, queryParams?: URLSearchParams): Observable<Requirement> {
    const restangular = expedient.restangular.one('requirements', id);
    return restangular
      .get(queryParams)
      .map(response => {
        const data = response.json();
        return Object.assign(new Requirement(restangular), data);
      });
  }

  getAll(queryParams?: URLSearchParams): Observable<Requirement[]> {
    const restangular = this.restangular.all(requirementsPath);
    return restangular
      .get(queryParams)
      .map(response => {
        const json = response.json();
        const requirements = new Array<Requirement>();
        json.data.forEach(element => {
          const requirement = new Requirement(restangular.one('', element[requirementIdName]));
          requirements.push(Object.assign(requirement, element));
        });
        return json;
      });  
  }

  create(requirement: any): Observable<any> {
    const restangular = this.restangular.all(requirementsPath);
    return restangular
      .post(requirement)
      .map(response => {
        if (response.status === 201 || 204) {
          return undefined;
        }
        const json = response.json();
        const requirements = new Array<Requirement>();
        json.forEach(element => {
          const requirement = new Requirement(restangular.one('', element[requirementIdName]));
          requirements.push(Object.assign(requirement, element));
        });
        return requirements;
      });
  }

}
