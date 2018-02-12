import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import * as _ from 'lodash';

import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const defaultConfigJson = '/assets/sacpinext.json';

const defaults = Object.freeze({
  apiEndpoint: "http://192.168.1.41:8117/api"
});
export function configServiceInitializer(config: ConfigService) {
  return () => config.load();
}

@Injectable()
export class ConfigService {

  private settingsRepository: any = defaults;

  constructor(private http: Http) { }

  public load(configJson: string = defaultConfigJson): Promise<any> {

    return this.http.get(configJson)
      .map((res: Response) => res.json())
      .toPromise()
      .then((config: any) => {
        this.settingsRepository = Object.freeze(_.merge({}, this.settingsRepository, config));
        return this.settingsRepository;
      })
      .catch((err: any) => {
        console.log(err);
        Promise.resolve();
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
