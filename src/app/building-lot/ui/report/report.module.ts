import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../../../core/core.module';
import { ShellComponentModule } from '../../shell/shell.module';
import { SharedModule } from '../../../shared/shared.module';

//import { TableModule } from 'patternfly-ng/table';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ProductBalanceComponent } from './product-balance/product-balance.component';

const routes: Routes = [
  { path: '', redirectTo: 'product-balance', pathMatch: 'full' },
  {
    path: 'product-balance',
    component: ProductBalanceComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ShellComponentModule,
    SharedModule,
    CoreModule,
   // TableModule
   BsDatepickerModule.forRoot()
  ],
  declarations: [
    ProductBalanceComponent
  ]
})
export class ReportModule { }
