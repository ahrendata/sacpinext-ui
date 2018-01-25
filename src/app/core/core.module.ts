import { ToastsManager } from 'ng2-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';

import { DataService } from './data/data.service';
import { ExpedientService } from './data/expedient.service';
import { RequirementService } from './data/requirement.service';
import { TokenService } from './guard/token.service';

import { ExpedientResolverService } from './resolvers/expedient-resolver.service';

import { RestangularService, CustomInterceptor } from './data/restangular.service';

import { UserService } from './data/user.service';
import { Configuration } from './../app.constants';
import { ConfigService } from './../config.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [

  ],
  providers: [
    DataService,
    RestangularService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true,
    },
    ExpedientService,
    RequirementService,
    UserService,
    TokenService,

    ExpedientResolverService
  ]
})
export class CoreModule { }
