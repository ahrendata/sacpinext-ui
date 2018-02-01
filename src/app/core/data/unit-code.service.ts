import { UnitCode } from './../model/unit-code.model';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { SearchCriteria } from './../model/search-criteria.model';
import { SearchResults } from './../model/search-results.model';
import { URLSearchParams } from '@angular/http';
import { RestangularService } from './restangular.service';
const unitcodeIdName = 'UnidCode';
const unitcodesPath = 'UnidCode';

@Injectable()
export class UnitCodeService {

    private restangular: RestangularService;
    constructor(restangular: RestangularService) {
        this.restangular = restangular.all(unitcodesPath);
    }

    findById(id: number, queryParams?: URLSearchParams): Observable<UnitCode> {
        const restangular = this.restangular.one(unitcodesPath, id);
        return restangular
            .get(queryParams)
            .map(response => {
                const data = response.json();
                return Object.assign(new UnitCode(restangular), data);
            });
    }

    getAll(queryParams?: URLSearchParams): Observable<UnitCode[]> {
        const restangular = this.restangular.all(unitcodesPath);
        return restangular
            .get(queryParams)
            .map(response => {
                const json = response.json();
                const unitcodes = Array<UnitCode>();
                json.forEach(element => {                  
                    const unitcode = new UnitCode(restangular.one('', element[unitcodeIdName]));
                    unitcodes.push(Object.assign(unitcode, element));
                });
                return unitcodes;
            });
    }

    search(criteria: SearchCriteria): Observable<SearchResults<UnitCode>> {
        const restangular = this.restangular.all(unitcodesPath);
        return restangular
            .all('search')
            .post(criteria)
            .map(response => {
                const json = response.json();

                const result = new SearchResults<UnitCode>();
                const items = new Array<UnitCode>();

                json.items.forEach(element => {
                    const unitcode = new UnitCode(restangular.all(element['id']));
                    items.push(Object.assign(unitcode, element));
                });

                result.items = items;
                result.totalSize = json.totalSize;
                return result;
            });
    }

}
