import { ContainerTypeCode } from './../model/container-types.model';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { SearchCriteria } from './../model/search-criteria.model';
import { SearchResults } from './../model/search-results.model';
import { URLSearchParams } from '@angular/http';
import { RestangularService } from './restangular.service';
// const typerequirementIdName = 'TypeRequirement';
// const typerequirementsPath = 'TypeRequirement';
const especialidadrequirementIdName = 'EspecialidadRequirement';
const especialidadrequirementsPath = 'EspecialidadRequirement';

@Injectable()
export class RequirementEspecialidadService {

    private restangular: RestangularService;
    constructor(restangular: RestangularService) {
        this.restangular = restangular.init();
    }

    findById(id: number, queryParams?: URLSearchParams): Observable<ContainerTypeCode> {
        const restangular = this.restangular.one(especialidadrequirementsPath, id);
        return restangular
            .get(queryParams)
            .map(response => {
                const data = response.json();
                return Object.assign(new ContainerTypeCode(restangular), data);
            });
    }

    getAll(queryParams?: URLSearchParams): Observable<ContainerTypeCode[]> {
        const restangular = this.restangular.all(especialidadrequirementsPath);
        return restangular
            .get(queryParams)
            .map(response => {
                const json = response.json();
                const typerequirements = Array<ContainerTypeCode>();
                json.forEach(element => {                  
                    const typerequirement = new ContainerTypeCode(restangular.one('', element[especialidadrequirementIdName]));
                    typerequirements.push(Object.assign(typerequirement, element));
                });
                return typerequirements;
            });
    }

    // getAll(queryParams?: URLSearchParams): Observable<Expedient[]> {
    //     const expedientsRestangular = this.restangular.all(expedientssPath);
    //     return expedientsRestangular
    //       .get(queryParams)
    //       .map(response => {
    //         const json = response.json();
    //         const expedients = new Array<Expedient>();
    //         json.forEach(element => {
    //           const expedient = new Expedient(expedientsRestangular.one('', element['IdExpediente']));
    //           expedients.push(Object.assign(expedient, element));
    //         });
    //         return expedients;
    //       });
    //   }

    search(criteria: SearchCriteria): Observable<SearchResults<ContainerTypeCode>> {
        const restangular = this.restangular.all(especialidadrequirementsPath);
        return restangular
            .all('search')
            .post(criteria)
            .map(response => {
                const json = response.json();

                const result = new SearchResults<ContainerTypeCode>();
                const items = new Array<ContainerTypeCode>();

                json.items.forEach(element => {
                    const typerequirement = new ContainerTypeCode(restangular.all(element['id']));
                    items.push(Object.assign(typerequirement, element));
                });

                result.items = items;
                result.totalSize = json.totalSize;
                return result;
            });
    }

}
