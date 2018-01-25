import { Requirement } from './../model/requirement.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Expedient } from './../model/expedient.model';
import { SearchCriteria } from './../model/search-criteria.model';
import { SearchResults } from './../model/search-results.model';
import { URLSearchParams } from '@angular/http';
import { RestangularService } from './restangular.service';
import { TokenService } from '../guard/token.service';
const expedientIdName = 'Expedient';
const expedientssPath = 'Expedient';

@Injectable()
export class ExpedientService {

  private restangular: RestangularService;

  constructor(restangular: RestangularService, private token: TokenService) {
    this.restangular = restangular.all(expedientssPath);
  }

  build(id: number): Expedient {
    return new Expedient(this.restangular.one(expedientssPath, id));
  }

  getUserId(): number {
    return this.token.getUserId();
  }

  getEmployeeId(): number {
    return this.token.getEmployeeId();
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

  create(expedient: Expedient): Observable<Expedient> {
    const expedientRestangular = this.restangular.all(expedientssPath);
    return expedientRestangular
      .post(expedient)
      .map(response => {
        if (response.status === 201 || 204) {
          return undefined;
        }
        const json = response.json();
        const result = new Expedient(expedientRestangular.one('', json[expedientIdName]));
        return Object.assign(result, json);
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
          const expedient = new Expedient(expedientsRestangular.one('', element[expedientIdName]));
          expedients.push(Object.assign(expedient, element));
        });
        return expedients;
      });
  }

}
