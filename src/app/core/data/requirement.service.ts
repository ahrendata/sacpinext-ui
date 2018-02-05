
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

  findById(id: number, queryParams?: URLSearchParams): Observable<Requirement> {
    const restangular = this.restangular.one(requirementsPath, id);
    return restangular
      .get(queryParams)
      .map(response => {
        const data = response.json();
        return Object.assign(new Requirement(restangular), data);
      });
  }

  viewById(id: number, queryParams?: URLSearchParams): Observable<Requirement> {
    const restangular = this.restangular.one(requirementsPath + '/Print', id);
    return restangular
      .post(queryParams)
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
        const json = response.json();
        return Object.assign(new Requirement(restangular), json);
      });
  }

  delete(id: number, queryParams?: URLSearchParams): Observable<any> {
    const restangular = this.restangular.one(requirementsPath, id);
    return restangular
      .deleteQuery(queryParams);
  }

  deletedetail(id: number, queryParams?: URLSearchParams): Observable<any> {
    const restangular = this.restangular.one('RequirementDetails', id);
    return restangular
      .deleteQuery(queryParams);
  }

  confirmar(queryParams?: URLSearchParams): Observable<any> {
    const restangular = this.restangular.all(requirementsPath + 'Confirm');
    return restangular
      .postQuery(queryParams)
      .map(response => {
        const json = response.json();
        return Object.assign(new Requirement(restangular), json);
      });
  }

}
