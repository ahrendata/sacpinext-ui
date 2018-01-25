import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../../core/guard/auth.guard';

const routes: Routes = [
  { path: '',canActivate: [AuthGuard]
  , component: DashboardComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),

    SharedModule,
    CoreModule
  ],
  entryComponents:[],
  declarations: [
    DashboardComponent
  ],
  exports:[DashboardComponent],
  providers:[]
})
export class DashboardModule { }
