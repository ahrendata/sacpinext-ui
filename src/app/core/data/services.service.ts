import { Services } from './../model/service.model';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { RestangularService } from './restangular.service';
import { SearchCriteria } from '../model/search-criteria.model';
import { SearchResults } from '../model/search-results.model';
import { URLSearchParams } from '@angular/http';

const serviceIdName = 'Service';
const servicesPath = 'Service';


@Injectable()
export class ServicesService {
  
  private restangular: RestangularService;
  constructor(restangular: RestangularService) {
    this.restangular = restangular.init();
  }
  findById(id: number, queryParams?: URLSearchParams): Observable<Services> {
    const restangular = this.restangular.one(servicesPath, id);
    return restangular
      .get(queryParams)
      .map(response => {
        const data = response.json();
        return Object.assign(new Services(restangular), data);
      });
  }

  viewById(id: number, queryParams?: URLSearchParams): Observable<Services> {
    const restangular = this.restangular.one(servicesPath + '/Print', id);
    return restangular
      .post(queryParams)
      .map(response => {
        const data = response.json();
        return Object.assign(new Services(restangular), data);
      });
  }

  getAll(queryParams?: URLSearchParams): Observable<Services[]> {
    const restangular = this.restangular.all(servicesPath);
    return restangular
      .get(queryParams)
      .map(response => {
        const json = response.json();
        const requirements = new Array<Services>();
        json.data.forEach(element => {
          const requirement = new Services(restangular.one('', element[serviceIdName]));
          requirements.push(Object.assign(requirement, element));
        });
        return json;
      });
  }

  search(criteria: SearchCriteria): Observable<SearchResults<Services>> {
    const restangular = this.restangular.all(servicesPath + '/filter');
    return restangular
      .post(criteria)
      .map(response => {
        const json = response.json();
        const result = new SearchResults<Services>();
        const items = new Array<Services>();
        json.data.forEach(element => {
          const document = new Services(restangular.all(element['IdService']));
          items.push(Object.assign(document, element));
        });
        result.items = items;
        result.totalSize = json.count;
        return result;
      });
  }

  create(requirement: any): Observable<any> {
    const restangular = this.restangular.all(servicesPath);
    return restangular
      .post(requirement)
      .map(response => {
        const json = response.json();
        return Object.assign(new Services(restangular), json);
      });
  }

  delete(queryParams?: URLSearchParams): Observable<any> {
    const restangular = this.restangular.all(servicesPath + '/ChangeStatus');
    return restangular
      .postQuery(queryParams)
      .map(response => {
        const json = response.json();
        return Object.assign(new Services(restangular), json);
      });  
  }

  deletedetail(queryParams?: URLSearchParams): Observable<any> {
    const restangular = this.restangular.all('ServiceDetails' + '/Status');
    return restangular
      .postQuery(queryParams)
      .map(response => {
        const json = response.json();
        return Object.assign(new Services(restangular), json);
      });
  }

  confirmar(queryParams?: URLSearchParams): Observable<any> {
    const restangular = this.restangular.all(servicesPath + 'Confirm');
    return restangular
      .postQuery(queryParams)
      .map(response => {
        const json = response.json();
        return Object.assign(new Services(restangular), json);
      });
  }

}
