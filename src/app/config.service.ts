import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import * as _ from 'lodash';

import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { Configuration } from './app.constants';

const defaultConfigJson = '/config/sacpinext.json';

const defaults = Object.freeze({
  apiEndpoint: "http://localhost:8080/api"
});
export function configServiceInitializer(config: ConfigService) {
  return () => config.load();
}

@Injectable()
export class ConfigService {


  private settingsRepository: any = defaults;

  constructor(private _http: Http/*, private _configuration: Configuration*/) { }

  // load(): any {  
  //   this.settingsRepository= Object.freeze({ apiEndpoint: this._configuration.ServerWithApiUrl });
  //   console.log(this.settingsRepository);
  //   return this.settingsRepository;

  // }

  load(configJson: string = defaultConfigJson): Promise<any> {
    return this._http.get(configJson).map(res => res.json())
      .toPromise()
      .then((config) => {
        this.settingsRepository = Object.freeze(_.merge({}, this.settingsRepository, config));
        return this;
      })
      .catch(() => {
        console.log('Error: Configuration service unreachable!');
      });
  }

  getSettings(group?: string, key?: string): any {
    if (!group) {
      return this.settingsRepository;
    }

    if (!this.settingsRepository[group]) {
      throw new Error(`Error: No setting found with the specified group [${group}]!`);
    }

    if (!key) {
      return this.settingsRepository[group];
    }

    if (!this.settingsRepository[group][key]) {
      throw new Error(`Error: No setting found with the specified group/key [${group}/${key}]!`);
    }

    return this.settingsRepository[group][key];
  }

}
