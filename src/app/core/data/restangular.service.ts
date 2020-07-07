import { RequestOptionsArgs, Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng6-toastr';
import { ConfigService } from '../../config.service';
import { RestangularBasePath } from './restangular-base-path';
import { URLSearchParams } from '@angular/http';

export function RestangularServiceFactory(http: Http, router: Router, config: ConfigService) {
  return new RestangularService(http, router, { url: config.getSettings().apiEndpoint });
}

@Injectable()
export class RestangularService {
  private _path: string;

  constructor(
    @Inject(Http) private _http: Http,
    @Inject(Router) private router: Router,
    @Inject(ConfigService) basePath: RestangularBasePath) {
    this._path = basePath.url;
  }

  get path() {
    return this._path;
  }

  get http() {
    return this._http;
  }

  one(path: string, id: number): RestangularService {
    const restangular = this.clone();
    restangular._path += (path ? '/' + path : '') + '/' + id;
    return restangular;
  }

  init(): RestangularService {
    const restangular = this.clone();
    restangular._path = restangular._path;//+ '/sacpinext';
    return restangular;
  }

  all(path: string): RestangularService {
    const restangular = this.clone();
    restangular._path = restangular._path + '/' + path;
    return restangular;
  }

  /*http methods*/
  get(queryParams?: URLSearchParams, options?: RequestOptionsArgs): Observable<Response> {
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

    return this._http.get(this._path, requestOptionsArgs);/*.catch((error) => {
      return this.handleError(error);
    });*/
  }

  post(obj?: any): Observable<Response> {
    return this._http.post(this._path, obj);/*.catch((error) => {
      return this.handleError(error);
    });*/
  }

  put(obj: any): Observable<Response> {
    const clone = Object.assign({}, obj);
    delete clone['_restangular'];

    return this._http.put(this._path, clone);/*.catch((error) => {
      return this.handleError(error);
    });*/
  }

  delete(): Observable<Response> {
    return this._http.delete(this._path);/*.catch((error) => {
      return this.handleError(error);
    });*/
  }

  clone(): RestangularService {
    return new RestangularService(this._http, this.router, { url: this._path });
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
    return this.http.delete(this._path, requestOptionsArgs);/*.catch((error) => {
      return this.handleError(error);
    });*/
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
    return this.http.post(this._path, {}, requestOptionsArgs);/*.catch((error) => {
      return this.handleError(error);
    });*/
  }



  handleError(error: any): Observable<Response> {
    if (error.status === 401) {
      this.router.navigate(['/sacpi/login']);
    } else if (error.status === 403) {
      this.router.navigate(['./forbidden']);
    } else if (error.status === 404) {
      this.router.navigate(['./not-found']);
    } else if (error.status) {
      let data: Response;
      try {
        data = (<Response>error).json();
      } catch (err) {
        console.log(err);
      }
      if (data && data['errorMessage']) {
        //  this.notifications.error('Error! ' + data['errorMessage']);
      } else {
        // this.notifications.error('Error! An unexpected server error has occurred');
      }
    }
    return Observable.throw(error);
  }
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