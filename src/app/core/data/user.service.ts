import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { User } from './../model/user.model';
import { SearchCriteria } from './../model/search-criteria.model';
import { SearchResults } from './../model/search-results.model';
import { RestangularService } from './restangular.service';

const usersPath = 'Users';

@Injectable()
export class UserService {

  public token: string;
  private restangular: RestangularService;

  constructor(restangular: RestangularService) {
    this.restangular = restangular.all(usersPath);
  }

  build(id: number): User {
    return new User(this.restangular.one(usersPath, id));
  }

  search(obj?: any): Observable<User> {
    console.log(obj);
    const userRestangular = this.restangular.all(usersPath + '/Login');
    return userRestangular
      .post(obj)
      .map(response => {  
        const user = new User(userRestangular);
        localStorage.setItem('sacpiuser',JSON.stringify(response.json()));
        return Object.assign(user, response.json());
      });
  }

  logout() {
    localStorage.removeItem('sacpiuser');
  }

}
