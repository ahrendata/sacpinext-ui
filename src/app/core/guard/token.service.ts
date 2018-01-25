import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {

    private TOKEN_KEY = 'sacpi-next';

    constructor() { }

    setToken(obj?: any): void {
        localStorage.setItem(this.TOKEN_KEY, JSON.stringify(obj));
    }

    getToken(): string {
        let item = JSON.parse(localStorage.getItem(this.TOKEN_KEY));
        return item;
    }
    removeToken(): void {
        if (this.getToken()) {
            localStorage.removeItem(this.TOKEN_KEY);
        }
    }

    clearToken(): void {
        localStorage.clear();
    }

    getEmployeeId(): number {
        if (this.getToken()) {
            let item = JSON.parse(localStorage.getItem(this.TOKEN_KEY));
            return item.IdEmployee;
        }
        return 0;
    }

    getUserId(): number {
        if (this.getToken()) {
            let item = JSON.parse(localStorage.getItem(this.TOKEN_KEY));
            return item.IdUser;
        }
        return 0;
    }
    getFullName(): string {
        if (this.getToken()) {
            let item = JSON.parse(localStorage.getItem(this.TOKEN_KEY));
            return item.FullName;
        }
        return "";
    }
    getUserName(): string {
        if (this.getToken()) {
            let item = JSON.parse(localStorage.getItem(this.TOKEN_KEY));
            return item.UserName;
        }
        return "";
    }
}