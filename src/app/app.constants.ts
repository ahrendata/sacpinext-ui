import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public Server = 'http://192.168.1.41:8117/';
    //    public Server = 'http://192.168.1.5:8788/';
    public ApiUrl = 'api';
    public ServerWithApiUrl = this.Server + this.ApiUrl;
}