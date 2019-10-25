import { FileService } from './data/file.service';
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
import { ConfigService } from './../config.service';
import { LoadingService } from './loading/loading.service';
import { BsModalService } from 'ngx-bootstrap';
import { DialogComponent } from './dialog/dialog.component';
import { ToastsManager } from 'ng6-toastr';
import { TruncatePipe } from './../shared/pipes/truncate.pipe';

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
    {
      provide: RestangularService,
      useFactory: RestangularServiceFactory,
      deps: [Http, Router, ConfigService]
    },
    LoadingService,
    ExpedientService,
    RequirementService,
    UserService,
    UnitCodeService,
    ProductService,
    RequirementTypeService,
    TokenService,
    BsModalService,
    TruncatePipe,
    FileService
  ]
})
export class CoreModule { }
