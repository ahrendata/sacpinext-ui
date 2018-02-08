import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { DataService } from './data/data.service';
import { ExpedientService } from './data/expedient.service';
import { RequirementService } from './data/requirement.service';
import { UnitCodeService } from './data/unit-code.service';
import { ProductService } from './data/product.service';
import { RequirementTypeService } from './data/requirement-type.service';
import { TokenService } from './guard/token.service';

import { ConfirmationModalComponent } from '../shared/components/confirmation-modal/confirmation-modal.component';
import { RestangularService, CustomInterceptor } from './data/restangular.service';
import { RestangularServiceFactory } from './data/restangular.service';

import { UserService } from './data/user.service';
import { Configuration } from './../app.constants';
import { ConfigService } from './../config.service';
import { LoadingService } from './loading/loading.service';
import { BsModalService } from 'ngx-bootstrap';
import { DialogComponent } from './dialog/dialog.component';
import { ToastsManager } from 'ng2-toastr';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    DialogComponent
  ],
  entryComponents: [
    DialogComponent,
    ConfirmationModalComponent
  ],
  exports: [
    DialogComponent
  ],
  providers: [
    DataService,
    // RestangularService,
    {
      provide: RestangularService,
      useFactory: RestangularServiceFactory,
      deps: [Http, Router, ToastsManager, ConfigService]
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: CustomInterceptor,
    //   multi: true,
    // },
    LoadingService,
    ExpedientService,
    RequirementService,
    UserService,
    UnitCodeService,
    ProductService,
    RequirementTypeService,
    TokenService,
    BsModalService
  ]
})
export class CoreModule { }
