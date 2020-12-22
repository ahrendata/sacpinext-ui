import { Services } from './../model/service.model';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { RestangularService } from './restangular.service';
import { SearchCriteria } from '../model/search-criteria.model';
import { SearchResults } from '../model/search-results.model';
import { URLSearchParams } from '@angular/http';

//const productIdName = 'SctrRegistry';
const sctrRegistryPath = 'SctrRegistry';

@Injectable()
export class SctrRegistryService {


    private restangular: RestangularService;
    constructor(restangular: RestangularService) {
        this.restangular = restangular.init();
    }

    findById(id: number, queryParams?: URLSearchParams): Observable<any> {
        const restangular = this.restangular.one(sctrRegistryPath, id);
        return restangular
            .get(queryParams)
            .map(response => {
                const data = response.json();
                //return Object.assign(new Requirement(restangular), data);
                return data;
            });
    }

    consultarDni(dni: number, queryParams?: URLSearchParams): Observable<any> {
        const restangular = this.restangular.one(sctrRegistryPath + '/ConsultarPersona', dni);
        return restangular
            .get(queryParams)
            .map(response => {
                const json = response.json();
                //return Object.assign(new Requirement(restangular), data);
                return json;
            });
    }

    create(sctrRegistry: any): Observable<any> {
        const restangular = this.restangular.all(sctrRegistryPath);
        return restangular
            .post(sctrRegistry)
            .map(response => {
                const json = response.json();
                //return Object.assign(new Requirement(restangular), json);
                return json;
            });
    }

    getAll(queryParams?: URLSearchParams): Observable<any[]> {
        const restangular = this.restangular.all(sctrRegistryPath);
        return restangular
            .get(queryParams)
            .map(response => {
                const json = response.json();
                // const products = new Array<any>();
                // json.forEach(element => {
                //     const product = new Product(restangular.one('', element[productIdName]));
                //     products.push(Object.assign(product, element));
                // });
                //return products;

                console.log(json);

                return [];
            });
    }


    search(criteria: SearchCriteria): Observable<SearchResults<any>> {
        const restangular = this.restangular.all(sctrRegistryPath + '/filter');
        return restangular
          .post(criteria)
          .map(response => {
            const json = response.json();
            const result = new SearchResults<any>();
            const items = new Array<any>();
            json.data.forEach(element => {             
              items.push(element);
            });
            result.items = items;
            result.totalSize = json.count;
            return result;
            

          });
      }

    // search(criteria: SearchCriteria): Observable<SearchResults<Product>> {
    //     const restangular = this.restangular.all(productsPath);
    //     return restangular
    //         .all('search')
    //         .post(criteria)
    //         .map(response => {
    //             const json = response.json();

    //             const result = new SearchResults<Product>();
    //             const items = new Array<Product>();

    //             json.items.forEach(element => {
    //                 const product = new Product(restangular.all(element['id']));
    //                 items.push(Object.assign(product, element));
    //             });

    //             result.items = items;
    //             result.totalSize = json.totalSize;
    //             return result;
    //         });
    // }

}
