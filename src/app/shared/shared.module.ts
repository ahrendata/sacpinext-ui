import { YesNoPipe } from './pipes/yes-no.pipe';
import { ToDatePipe } from './pipes/to-date.pipe';
//import { ToastModule } from 'ng2-toastr';
//import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from './pipes/truncate.pipe';
import { ButtonCancelComponent } from './components/button-cancel/button-cancel.component';
import { ButtonDeleteComponent } from './components/button-delete/button-delete.component';
import { ButtonResetComponent } from './components/button-reset/button-reset.component';
import { ButtonSaveComponent } from './components/button-save/button-save.component';
import { ButtonSwitchComponent } from './components/button-switch/button-switch.component';
import { LoadingComponent } from './components/loading/loading.component';
import { OnOffSwitchStringComponent } from './components/on-off-switch-string/on-off-switch-string.component';
import { FormFieldValidationMessagesComponent } from './components/form-field-validation-messages/form-field-validation-messages.component';
import { FormFieldsStatusComponent } from './components/form-fields-status/form-fields-status.component';

import { FormFieldValidationStateDirective } from './directives/form-field-validation-state.directive';
import { FormRequiredLabelDirective } from './directives/form-required-label.directive';
import { NumberMaskDirective } from './directives/number-mask.directive';
import { ButtonLoginComponent } from './components/button-login/button-login.component';

//import { MomentModule } from 'angular2-moment';
import { NgSelectModule } from '@ng-select/ng-select';
//import { SelectModule } from 'ng2-select';
//import { TextMaskModule } from 'angular2-text-mask';
import { ButtonAddComponent } from './components/button-add/button-add.component';
import { ButtonConfirmarComponent } from './components/button-confirmar/button-confirmar.component';

import { ToolbarModule } from 'patternfly-ng/toolbar';
import { ListModule } from 'patternfly-ng/list';
import { ActionModule } from 'patternfly-ng/action';
import { PaginationModule } from 'patternfly-ng/pagination';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    //NgbModule,
    BsDropdownModule,
    ModalModule,
    //MomentModule,
    //JWBootstrapSwitchModule,
    //ToastModule,
    //SelectModule,
    NgSelectModule,
    ToolbarModule,
    ListModule,
    ActionModule,
    PaginationModule
    // TextMaskModule
  ],
  declarations: [
    TruncatePipe,
    ToDatePipe,
    YesNoPipe,
    ButtonCancelComponent,
    ButtonDeleteComponent,
    ButtonResetComponent,
    ButtonSaveComponent,
    ButtonSwitchComponent,
    ButtonLoginComponent,
    ButtonAddComponent,
    ButtonConfirmarComponent,
    LoadingComponent,
    OnOffSwitchStringComponent,
    FormFieldValidationMessagesComponent,
    FormFieldsStatusComponent,
    FormRequiredLabelDirective,
    NumberMaskDirective,
    FormFieldValidationStateDirective

  ],
  exports: [
    //NgbModule,
    BsDropdownModule,
    ModalModule,
    // MomentModule,
    //JWBootstrapSwitchModule,
    NgSelectModule,
    ToolbarModule,
    ListModule,
    ActionModule,
    PaginationModule,
    //SelectModule,
    // ToastModule,
    // TextMaskModule,

    ButtonDeleteComponent,
    ButtonSaveComponent,
    ButtonCancelComponent,
    ButtonResetComponent,
    ButtonSwitchComponent,
    ButtonLoginComponent,
    ButtonAddComponent,
    ButtonConfirmarComponent,
    OnOffSwitchStringComponent,

    TruncatePipe,
    ToDatePipe,
    YesNoPipe,

    FormFieldValidationMessagesComponent,
    FormFieldsStatusComponent,

    NumberMaskDirective,
    FormRequiredLabelDirective,
    FormFieldValidationStateDirective,
    LoadingComponent
  ]
})
export class SharedModule { }
