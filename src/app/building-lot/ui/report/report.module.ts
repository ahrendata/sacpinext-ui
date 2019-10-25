import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../../../core/core.module';
import { ShellComponentModule } from '../../shell/shell.module';
import { SharedModule } from '../../../shared/shared.module';
import { ProductBalanceComponent } from './product-balance/product-balance.component';
import { TableModule } from 'patternfly-ng';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';

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
    TableModule,
    BsDropdownModule.forRoot(), 
    // NgxDatatableModule
  ],
  declarations: [
    ProductBalanceComponent
  ]
})
export class ReportModule { }
