
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
        console.log(JSON.stringify(json));
        const result = new Array<Requirement>();
        // json.items.forEach(element => {
        //   const requirement = new Requirement(restangular.one('',element[requirementIdName]));
        //   result.push(Object.assign(requirement, element));
        // });
        return json;
      });
      // return expedientsRestangular
      // .get(queryParams)
      // .map(response => {
      //   const json = response.json();
      //   const expedients = new Array<Expedient>();
      //   json.forEach(element => {
      //     const expedient = new Expedient(expedientsRestangular.one('', element[expedientIdName]));
      //     expedients.push(Object.assign(expedient, element));
      //   });
      //   return expedients;
      // });
  }

  search(expedient: Expedient, criteria: SearchCriteria): Observable<SearchResults<Requirement>> {
    const restangular = expedient.restangular.all('requirements');
    return restangular
      .all('search')
      .post(criteria)
      .map(response => {
        const json = response.json();

        const result = new SearchResults<Requirement>();
        const items = new Array<Requirement>();

        json.items.forEach(element => {
          const requirement = new Requirement(restangular.all(element['id']));
          items.push(Object.assign(requirement, element));
        });

        result.items = items;
        result.totalSize = json.totalSize;
        return result;
      });
  }

}
