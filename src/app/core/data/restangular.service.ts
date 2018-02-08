import { RequestOptionsArgs, Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';
import { Configuration } from '../../app.constants';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ConfigService } from '../../config.service';
import { RestangularBasePath } from './restangular-base-path';

export function RestangularServiceFactory(http: Http, router: Router, notifications: ToastsManager, config: ConfigService) {
  return new RestangularService(http, router, notifications, { url: config.getSettings().apiEndpoint });
}

@Injectable()
export class RestangularService {
  private _path: string;

  constructor(
    private _http: Http,
    private router: Router,
    private notifications: ToastsManager,
    basePath: RestangularBasePath) {
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
    restangular._path = restangular._path ;//+ '/sacpinext';
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

    return this._http.get(this._path, requestOptionsArgs).catch((error) => {
      return this.handleError(error);
    });
  }

  post(obj?: any): Observable<Response> {
    return this._http.post(this._path, obj).catch((error) => {
      return this.handleError(error);
    });
  }

  put(obj: any): Observable<Response> {
    const clone = Object.assign({}, obj);
    delete clone['_restangular'];

    return this._http.put(this._path, clone).catch((error) => {
      return this.handleError(error);
    });
  }

  delete(): Observable<Response> {
    return this._http.delete(this._path).catch((error) => {
      return this.handleError(error);
    });
  }

  clone(): RestangularService {
    return new RestangularService(this._http, this.router, this.notifications, { url: this._path });
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
    return this.http.delete(this._path, requestOptionsArgs).catch((error) => {
      return this.handleError(error);
    });
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
    return this.http.post(this._path, {}, requestOptionsArgs).catch((error) => {
      return this.handleError(error);
    });
  }



  handleError(error: any): Observable<Response> {
    if (error.status === 401) {
      this.router.navigate(['./login']);
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
        this.notifications.error('Error! ' + data['errorMessage']);
      } else {
        this.notifications.error('Error! An unexpected server error has occurred');
      }
    }
    return Observable.throw(error);
  }





  // clone(): RestangularService {
  //   return new RestangularService(this.http, this._configuration);
  // }
  // private actionUrl: string;

  // constructor(private http: Http, private _configuration: Configuration) {
  //   this.actionUrl = _configuration.ServerWithApiUrl;
  // }

  // one(path: string, id: number): RestangularService {
  //   const restangular = this.clone();
  //   restangular.actionUrl += (path ? '/' + path : '') + '/' + id;
  //   return restangular;
  // }

  // all(path: string): RestangularService {
  //   const restangular = this.clone();
  //   restangular.actionUrl = restangular.actionUrl + '/' + path;
  //   return restangular;
  // }

  // public get(queryParams?: URLSearchParams, options?: RequestOptionsArgs): Observable<Response> {
  //   let requestOptionsArgs;
  //   if (queryParams || options) {
  //     requestOptionsArgs = {
  //       headers: new Headers()
  //     };

  //     if (queryParams) {
  //       requestOptionsArgs.search = queryParams;
  //     }
  //     if (options) {
  //       requestOptionsArgs = Object.assign(requestOptionsArgs, options);
  //     }
  //   }
  //   return this.http.get(this.actionUrl, requestOptionsArgs);
  // }

  // public post(obj?: any): Observable<Response> {
  //   return this.http.post(this.actionUrl, obj);
  // }

  // public put(obj: any): Observable<Response> {
  //   const clone = Object.assign({}, obj);
  //   delete clone['_restangular'];
  //   return this.http.put(this.actionUrl, clone);
  // }

  // public putId(id: number, obj: any): Observable<Response> {
  //   return this.http.put(this.actionUrl, JSON.stringify(obj));
  // }

  // public delete(): Observable<Response> {
  //   return this.http.delete(this.actionUrl);
  // }

  // /*Alternatives with QueryParam */

  // public deleteQuery(queryParams?: URLSearchParams, options?: RequestOptionsArgs): Observable<Response> {
  //   let requestOptionsArgs;
  //   if (queryParams || options) {
  //     requestOptionsArgs = {
  //       headers: new Headers()
  //     };

  //     if (queryParams) {
  //       requestOptionsArgs.search = queryParams;
  //     }
  //     if (options) {
  //       requestOptionsArgs = Object.assign(requestOptionsArgs, options);
  //     }
  //   }
  //   return this.http.delete(this.actionUrl, requestOptionsArgs);
  // }

  // public postQuery(queryParams?: URLSearchParams, options?: RequestOptionsArgs): Observable<Response> {
  //   let requestOptionsArgs;
  //   if (queryParams || options) {
  //     requestOptionsArgs = {
  //       headers: new Headers()
  //     };

  //     if (queryParams) {
  //       requestOptionsArgs.search = queryParams;
  //     }
  //     if (options) {
  //       requestOptionsArgs = Object.assign(requestOptionsArgs, options);
  //     }
  //   }
  //   return this.http.post(this.actionUrl,{}, requestOptionsArgs);
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