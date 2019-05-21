import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {

    private TOKEN_KEY = 'sacpi-next';
    private FILTER_REQUIREMENT = 'sacpi-filter';
    private PAGING_REQUIREMENT = 'sacpi-paging';

    constructor() { }

    setToken(obj?: any): void {
        //console.log(JSON.stringify(obj));
        sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(obj));
    }

    getToken(): string {
        let item = JSON.parse(sessionStorage.getItem(this.TOKEN_KEY));
        // console.log(item);
        return item;
    }
    removeToken(): void {
        if (this.getToken()) {
            sessionStorage.removeItem(this.TOKEN_KEY);
        }
    }

    clearToken(): void {
        sessionStorage.clear();
    }

    getEmployeeId(): number {
        if (this.getToken()) {
            let item = JSON.parse(sessionStorage.getItem(this.TOKEN_KEY));
            return item.IdEmployee;
        }
        return 0;
    }

    getUserId(): number {
        if (this.getToken()) {
            let item = JSON.parse(sessionStorage.getItem(this.TOKEN_KEY));
            return item.IdUser;
        }
        return 0;
    }
    getFullName(): string {
        if (this.getToken()) {
            let item = JSON.parse(sessionStorage.getItem(this.TOKEN_KEY));
            return item.FullName;
        }
        return "";
    }
    getUserName(): string {
        if (this.getToken()) {
            let item = JSON.parse(sessionStorage.getItem(this.TOKEN_KEY));
            return item.UserName;
        }
        return "";
    }

    setFilterCriteriaReq(obj?: any): void {
        console.log("set data : "+JSON.stringify(obj));
        sessionStorage.setItem(this.FILTER_REQUIREMENT, JSON.stringify(obj));
    }
    getFilterCriteriaReq(): object {
        let item = JSON.parse(sessionStorage.getItem(this.FILTER_REQUIREMENT));
        //console.log(item);
        return item;
    }
    setPagingCriteriaReq(obj?: any): void {
        //console.log(JSON.stringify(obj));
        sessionStorage.setItem(this.PAGING_REQUIREMENT, JSON.stringify(obj));
    }
    getPagingCriteriaReq(): object {
        let item = JSON.parse(sessionStorage.getItem(this.PAGING_REQUIREMENT) != undefined ? sessionStorage.getItem(this.PAGING_REQUIREMENT) : null);
        //console.log(item);
        return item;
    }

}