
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Requirement } from './../model/requirement.model';
import { Expedient } from './../model/expedient.model';

import { SearchCriteria } from './../model/search-criteria.model';
import { SearchResults } from './../model/search-results.model';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class RequirementService {

  constructor() { }

  findById(expedient: Expedient, id: number, queryParams?: URLSearchParams): Observable<Requirement> {
    const restangular = expedient.restangular.one('requirements', id);
    return restangular     
      .get(queryParams)
      .map(response => {
        const data = response.json();
        return Object.assign(new Requirement(restangular), data);
      });
  }

  getAll(expedient: Expedient, queryParams?: URLSearchParams): Observable<Requirement[]> {
    const restangular = expedient.restangular.all('requirements');
    return restangular
      .get(queryParams)
      .map(response => {
        const json = response.json();
        const result = new Array<Requirement>();
        json.items.forEach(element => {
          const requirement = new Requirement(restangular.all(element['id']));
          result.push(Object.assign(requirement, element));
        });
        return result;
      });
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
