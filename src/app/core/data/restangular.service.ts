import { RequestOptionsArgs, Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import { Configuration } from '../../app.constants';
import { Response } from '@angular/http';

@Injectable()
export class RestangularService {

  clone(): RestangularService {
    return new RestangularService(this.http, this._configuration);
  }
  private actionUrl: string;

  constructor(private http: Http, private _configuration: Configuration) {
    this.actionUrl = _configuration.ServerWithApiUrl;
  }

  one(path: string, id: number): RestangularService {
    const restangular = this.clone();
    restangular.actionUrl += (path ? '/' + path : '') + '/' + id;
    return restangular;
  }

  all(path: string): RestangularService {
    const restangular = this.clone();
    restangular.actionUrl = restangular.actionUrl + '/' + path;
    return restangular;
  }

  public get(queryParams?: URLSearchParams, options?: RequestOptionsArgs): Observable<Response> {
    let requestOptionsArgs;
    if (queryParams || options) {
      requestOptionsArgs = {
        headers: new Headers()
      };

      if (queryParams) {
        requestOptionsArgs.search = queryParams;
      }
      if (options) {
        requestOptionsArgs = Object.assign(requestOptionsArgs, options);
      }
    }
    return this.http.get(this.actionUrl, requestOptionsArgs);
  }

  public post(obj?: any): Observable<Response> {
    return this.http.post(this.actionUrl, obj);
  }

  public put(obj: any): Observable<Response> {
    const clone = Object.assign({}, obj);
    delete clone['_restangular'];
    return this.http.put(this.actionUrl, clone);
  }

  public putId(id: number, obj: any): Observable<Response> {
    return this.http.put(this.actionUrl, JSON.stringify(obj));
  }

  public delete(): Observable<Response> {
    return this.http.delete(this.actionUrl);
  }

  /*Alternatives with QueryParam */

  public deleteQuery(queryParams?: URLSearchParams, options?: RequestOptionsArgs): Observable<Response> {
    let requestOptionsArgs;
    if (queryParams || options) {
      requestOptionsArgs = {
        headers: new Headers()
      };

      if (queryParams) {
        requestOptionsArgs.search = queryParams;
      }
      if (options) {
        requestOptionsArgs = Object.assign(requestOptionsArgs, options);
      }
    }
    return this.http.delete(this.actionUrl, requestOptionsArgs);
  }

  public postQuery(queryParams?: URLSearchParams, options?: RequestOptionsArgs): Observable<Response> {
    let requestOptionsArgs;
    if (queryParams || options) {
      requestOptionsArgs = {
        headers: new Headers()
      };

      if (queryParams) {
        requestOptionsArgs.search = queryParams;
      }
      if (options) {
        requestOptionsArgs = Object.assign(requestOptionsArgs, options);
      }
    }
    return this.http.post(this.actionUrl,{}, requestOptionsArgs);
  }

  // public getAll<T>(path: string): Observable<T> {
  //   return this.http.get<T>(this.actionUrl + '/' + path);
  // }

  // public getSingle<T>(path: string, id: number): Observable<T> {
  //   return this.http.get<T>(this.actionUrl + '/' + path + id);
  // }

  // public add<T>(path: string, obj?: any): Observable<T> {
  //   const toAdd = JSON.stringify(obj);

  //   return this.http.post<T>(this.actionUrl + '/' + path, toAdd);
  // }

  // public update<T>(path: string, id: number, itemToUpdate: any): Observable<T> {
  //   return this.http
  //     .put<T>(this.actionUrl + '/' + path + id, JSON.stringify(itemToUpdate));
  // }

  // public delete<T>(path: string, id: number): Observable<T> {
  //   return this.http.delete<T>(this.actionUrl + '/' + path + id);
  // }
}


@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.headers.has('Content-Type')) {
      req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    }
    req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
    return next.handle(req);
  }
}