import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { User } from './../model/user.model';
import { SearchCriteria } from './../model/search-criteria.model';
import { SearchResults } from './../model/search-results.model';
import { RestangularService } from './restangular.service';
import { TokenService } from './../guard/token.service';

const usersPath = 'Users';

@Injectable()
export class UserService {

  private restangular: RestangularService;

  constructor(restangular: RestangularService, private token: TokenService) {
    this.restangular = restangular.init();
  }

  build(id: number): User {
    return new User(this.restangular.one(usersPath, id));
  }

  getUserId(): number {
    return this.token.getUserId();
  }
  
  getUser(): string {
    return this.token.getFullName();
  }

  getUserName(): string {
    return this.token.getUserName();
  }

  getEmployeeId(): number {
    return this.token.getEmployeeId();
  }

  search(obj?: any): Observable<User> {
    const userRestangular = this.restangular.all(usersPath + '/Login');
    return userRestangular
      .post(obj)
      .map(response => {
        const user = new User(userRestangular);
        this.token.setToken(response.json());
        return Object.assign(user, response.json());
      });
  }

  findToken() {
    if (this.token.getToken()) {
      return true;
    }
    return false;
  }

  logout() {
    this.token.removeToken();
  }

}
