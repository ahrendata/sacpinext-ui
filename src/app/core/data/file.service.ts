import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Requirement } from './../model/requirement.model';
import { Expedient } from './../model/expedient.model';

import { SearchCriteria } from './../model/search-criteria.model';
import { SearchResults } from './../model/search-results.model';
import { URLSearchParams } from '@angular/http';
import { RestangularService } from './restangular.service';
const fileIdName = 'File';
const filePath = 'File';

@Injectable()
export class FileService {

  private restangular : RestangularService;

  constructor( restangular : RestangularService) {
    this.restangular = restangular.init();
   }
   

  delete(queryParams?: URLSearchParams): Observable<any> {
    const restangular = this.restangular.all(filePath + '/ChangeStatus');
    return restangular
      .postQuery(queryParams)
      .map(response => {
        const json = response.json();
        return json;
      });  
  }

  deleteNext(queryParams?: URLSearchParams): Observable<any> {
    const restangular = this.restangular.all(filePath + '/delete');
    return restangular
      .postQuery(queryParams)
      .map(response => {
        const json = response.json();
        return json;
      });  
  }

  deleteAll(queryParams?: URLSearchParams): Observable<any> {
    const restangular = this.restangular.all(filePath + '/ChangeStatusAll');
    return restangular
      .postQuery(queryParams)
      .map(response => {
        const json = response.json();
        return Object.assign(new Requirement(restangular), json);
      });  
  }

  DownloadById(id: number, queryParams?: URLSearchParams): Observable<any> {
    const restangular = this.restangular.one(filePath+'Download', id);
    return restangular
      .get(queryParams)
      .map(response => {
        const data = response.json();
        return data;
      });
  }

  DownloadNext(queryParams?: URLSearchParams): Observable<any> {
    const restangular = this.restangular.all(filePath+'/download');
    return restangular
      .postQuery(queryParams)
      .map(response => {
        const data = response.json();
        return data;
      });
  }

  saveNext( list : any): Observable<any> {
    const restangular = this.restangular.all(filePath + '/saveFiles');
    return restangular
      .post(list)
      .map(response => {
        const json = response.json();
        return Object.assign(new Requirement(restangular), json);
      });
  }

  getAll(queryParams?: URLSearchParams): Observable<any[]> {
    const restangular = this.restangular.all(filePath+"/getAll");
    return restangular
      .get(queryParams)
      .map(response => {
        const json = response.json();
        return json;
      });
  }
}
