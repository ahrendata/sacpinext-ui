import { Product } from './../model/product.model';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { SearchCriteria } from './../model/search-criteria.model';
import { SearchResults } from './../model/search-results.model';
import { URLSearchParams } from '@angular/http';URLSearchParams
import { RestangularService } from './restangular.service';
const productIdName = 'Product';
const productsPath = 'Product';

@Injectable()
export class ProductService {


    private restangular: RestangularService;
    constructor(restangular: RestangularService) {
        this.restangular = restangular.init();
    }

    findById(id: number, queryParams?: URLSearchParams): Observable<Product> {
        const restangular = this.restangular.one(productsPath, id);
        return restangular
            .get(queryParams)
            .map(response => {
                const data = response.json();
                return Object.assign(new Product(restangular), data);
            });
    }

    getAll(queryParams?: URLSearchParams): Observable<Product[]> {
        const restangular = this.restangular.all(productsPath);
        return restangular
            .get(queryParams)
            .map(response => {
                const json = response.json();
                const products = new Array<Product>();
                json.forEach(element => {
                    const product = new Product(restangular.one('', element[productIdName]));
                    products.push(Object.assign(product, element));
                });
                return products;
            });
    }

    search(criteria: SearchCriteria): Observable<SearchResults<Product>> {
        const restangular = this.restangular.all(productsPath);
        return restangular
            .all('search')
            .post(criteria)
            .map(response => {
                const json = response.json();

                const result = new SearchResults<Product>();
                const items = new Array<Product>();

                json.items.forEach(element => {
                    const product = new Product(restangular.all(element['id']));
                    items.push(Object.assign(product, element));
                });

                result.items = items;
                result.totalSize = json.totalSize;
                return result;
            });
    }

}
