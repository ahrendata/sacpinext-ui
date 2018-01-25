import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoadingService {

  private resourceRequests: number;
  private loadingTimer: any;

  private loadingValue: boolean;
  private loadingSource = new Subject<boolean>();
  _loading = this.loadingSource.asObservable();

  constructor() {
    this.resourceRequests = 0;
    this.loadingTimer = -1;
    this.loadingValue = false;
  }

  incrementResourceRequests() {
    if (this.resourceRequests === 0) {
      this.loadingTimer = setTimeout(() => {
        this.loadingValue = true;
        this.loadingTimer = -1;
        this.loadingSource.next(this.loadingValue);
      }, 500);
    }
    this.resourceRequests++;
  }

  reduceResourceRequests() {
    this.resourceRequests--;
    if (this.resourceRequests === 0) {
      if (this.loadingTimer !== -1) {
        window.clearTimeout(this.loadingTimer);
        this.loadingTimer = -1;
      }
      this.loadingValue = false;
      this.loadingSource.next(this.loadingValue);
    }
  }

  get loading() {
    return this._loading;
  }

}
