import { Requirement } from './../model/requirement.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Expedient } from './../model/expedient.model';
import { SearchCriteria } from './../model/search-criteria.model';
import { SearchResults } from './../model/search-results.model';
import { URLSearchParams } from '@angular/http';
import { RestangularService } from './restangular.service';
const expedientIdName = 'Expedient';
const expedientssPath = 'Expedient';

@Injectable()
export class ExpedientService {

  private restangular: RestangularService;

  constructor(restangular: RestangularService) {
    this.restangular = restangular.init();
  }

  build(id: number): Expedient {
    return new Expedient(this.restangular.one(expedientssPath, id));
  }
  findById(id: number): Observable<Expedient> {
    const expedientRestangular = this.restangular.one(expedientssPath, id);
    return expedientRestangular
      .get()
      .map(response => {
        const expedient = new Expedient(expedientRestangular);
        return Object.assign(expedient, response.json());
      });
  }

  getAll(queryParams?: URLSearchParams): Observable<Expedient[]> {
    const expedientsRestangular = this.restangular.all(expedientssPath);
    return expedientsRestangular
      .get(queryParams)
      .map(response => {
        const json = response.json();
        const expedients = new Array<Expedient>();
        json.forEach(element => {
          const expedient = new Expedient(expedientsRestangular.one('', element['IdExpediente']));
          expedients.push(Object.assign(expedient, element));
        });
        return expedients;
      });
  }
  search(criteria: SearchCriteria): Observable<SearchResults<Expedient>> {
    const restangular = this.restangular.all(expedientssPath + '/filter');
    return restangular
      .post(criteria)
      .map(response => {
        const json = response.json();
        const result = new SearchResults<Expedient>();
        const items = new Array<Expedient>();
        json.items.forEach(element => {
          const document = new Expedient(restangular.all(element['IdExpediente']));
          items.push(Object.assign(document, element));
        });
        result.items = items;
        result.totalSize = json.totalSize;
        return result;
      });
  }

}
