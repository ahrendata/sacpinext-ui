import { YesNoPipe } from './pipes/yes-no.pipe';
import { ToDatePipe } from './pipes/to-date.pipe';
import { BsDropdownModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
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
import { OnlyNumberDirective } from './directives/only-number.directive';
import { EqualValidatorDirective } from './directives/password-match.directive';

import { NgSelectModule } from '@ng-select/ng-select';

import { ButtonAddComponent } from './components/button-add/button-add.component';
import { ButtonConfirmarComponent } from './components/button-confirmar/button-confirmar.component';
import { ButtonLoginComponent } from './components/button-login/button-login.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

import { VerticalNavigationModule, WizardModule, PaginationModule, ActionModule, ListModule, ToolbarModule } from 'patternfly-ng';
import { ReadFileComponent } from './components/read-file/read-file.component';
import { ReadFile2Component } from './components/read-file2/read-file2.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule,
    ModalModule,
    TooltipModule,
    NgSelectModule,
    ToolbarModule,
    ListModule,
    ActionModule,
    PaginationModule,
    VerticalNavigationModule,
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
    OnlyNumberDirective,
    EqualValidatorDirective,
    FormFieldValidationStateDirective,
    ConfirmationModalComponent,
    ReadFileComponent,
    ReadFile2Component
  ],
  exports: [
    BsDropdownModule,
    ModalModule,
    TooltipModule,
    NgSelectModule,
    ToolbarModule,
    ListModule,
    ActionModule,
    PaginationModule,
    VerticalNavigationModule,
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
    OnlyNumberDirective,
    NumberMaskDirective,
    FormRequiredLabelDirective,
    FormFieldValidationStateDirective,
    LoadingComponent,
    ReadFileComponent,
    ReadFile2Component
  ]
})
export class SharedModule { }
