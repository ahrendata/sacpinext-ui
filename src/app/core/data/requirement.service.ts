
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
    this.restangular = restangular.init();
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

  findByIdService(id: number, queryParams?: URLSearchParams): Observable<Requirement> {
    const restangular = this.restangular.one(requirementsPath+'Service', id);
    return restangular
      .get(queryParams)
      .map(response => {
        const data = response.json();
        return Object.assign(new Requirement(restangular), data);
      });
  }

  viewByIdService(id: number, queryParams?: URLSearchParams): Observable<Requirement> {
    const restangular = this.restangular.one(requirementsPath + '/PrintService', id);
    return restangular
      .post(queryParams)
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

  search(criteria: SearchCriteria): Observable<SearchResults<Requirement>> {
    const restangular = this.restangular.all(requirementsPath + '/filter');
    return restangular
      .post(criteria)
      .map(response => {
        const json = response.json();
        const result = new SearchResults<Requirement>();
        const items = new Array<Requirement>();
        json.data.forEach(element => {
          const document = new Requirement(restangular.all(element['IdRequirement']));
          items.push(Object.assign(document, element));
        });
        result.items = items;
        result.totalSize = json.count;
        return result;
      });
  }

  searchService(criteria: SearchCriteria): Observable<SearchResults<Requirement>> {
    const restangular = this.restangular.all(requirementsPath+'Service' + '/filter');
    return restangular
      .post(criteria)
      .map(response => {
        const json = response.json();
        const result = new SearchResults<Requirement>();
        const items = new Array<Requirement>();
        json.data.forEach(element => {
          const document = new Requirement(restangular.all(element['IdRequirement']));
          items.push(Object.assign(document, element));
        });
        result.items = items;
        result.totalSize = json.count;
        return result;
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

  delete(queryParams?: URLSearchParams): Observable<any> {
    const restangular = this.restangular.all(requirementsPath + '/ChangeStatus');
    return restangular
      .postQuery(queryParams)
      .map(response => {
        const json = response.json();
        return Object.assign(new Requirement(restangular), json);
      });  
  }

  deletedetail(queryParams?: URLSearchParams): Observable<any> {
    const restangular = this.restangular.all('RequirementDetails' + '/Status');
    return restangular
      .postQuery(queryParams)
      .map(response => {
        const json = response.json();
        return Object.assign(new Requirement(restangular), json);
      });
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

  getAllSaldo(queryParams?: URLSearchParams): Observable<any[]> {
    const restangular = this.restangular.all(requirementsPath+'/SaldosProducto');
    return restangular
      .postQuery(queryParams)
      .map(response => {
        const json = response.json();
         return json;
      });
  }

  getlistTipoDocumento(): Observable<any[]> {
    const restangular = this.restangular.all(requirementsPath+'/getListTipoDocumento');
    return restangular
      .get()
      .map(response => {
        const json = response.json();
         return json;
      });
  }
}
