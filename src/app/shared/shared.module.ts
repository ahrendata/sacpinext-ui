import { YesNoPipe } from './pipes/yes-no.pipe';
import { ToDatePipe } from './pipes/to-date.pipe';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
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

import { NgSelectModule } from '@ng-select/ng-select';


import { ButtonAddComponent } from './components/button-add/button-add.component';
import { ButtonConfirmarComponent } from './components/button-confirmar/button-confirmar.component';

import { ToolbarModule } from 'patternfly-ng/toolbar';
import { ListModule } from 'patternfly-ng/list';
import { ActionModule } from 'patternfly-ng/action';
import { PaginationModule } from 'patternfly-ng/pagination';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { NavigationModule, WizardModule } from 'patternfly-ng';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule,
    ModalModule,
    NgSelectModule,
    ToolbarModule,
    ListModule,
    ActionModule,
    PaginationModule,
    NavigationModule,
    WizardModule
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
    FormFieldValidationStateDirective,
    ConfirmationModalComponent
  ],
  exports: [
    BsDropdownModule,
    ModalModule,
    NgSelectModule,
    ToolbarModule,
    ListModule,
    ActionModule,
    PaginationModule,
    NavigationModule,
    WizardModule,
    ButtonDeleteComponent,
    ButtonSaveComponent,
    ButtonCancelComponent,
    ButtonResetComponent,
    ButtonSwitchComponent,
    ButtonLoginComponent,
    ButtonAddComponent,
    ButtonConfirmarComponent,
    OnOffSwitchStringComponent,
    ConfirmationModalComponent,
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
