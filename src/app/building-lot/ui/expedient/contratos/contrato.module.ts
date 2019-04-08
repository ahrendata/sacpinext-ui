import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { ShellComponentModule } from '../../../shell/shell.module';
import { AuthGuard } from '../../../../core/guard/auth.guard';
import { ContratosListComponent } from './contratos-list/contratos-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',canActivate: [AuthGuard],
    component: ContratosListComponent
  }
 
];

@NgModule({
  declarations: [ContratosListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ShellComponentModule,  

    SharedModule,
    CoreModule
  ]

})
export class ContratoModule { }
