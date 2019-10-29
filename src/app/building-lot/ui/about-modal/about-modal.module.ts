import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutModalComponent } from './about-modal.component';
import { ModalModule as BSModalModule } from 'ngx-bootstrap/modal';
import { AboutModalModule } from 'patternfly-ng/modal';

@NgModule({
  imports: [
    CommonModule,
    BSModalModule.forRoot(),
    AboutModalModule
  ],
  declarations: [AboutModalComponent],
  exports: [
    AboutModalComponent
  ]
})
export class AboutModalModule1 {
  constructor() { }
 }
