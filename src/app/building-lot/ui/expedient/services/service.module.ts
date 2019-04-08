import { CoreModule } from './../../../../core/core.module';
import { SharedModule } from './../../../../shared/shared.module';
import { ShellComponentModule } from './../../../shell/shell.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthGuard } from './../../../../core/guard/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceEditComponent } from './service-edit/service-edit.component';
import { ServiceViewComponent } from './service-view/service-view.component';
import { ServiceCreateComponent } from './service-create/service-create.component';
import { ServiceListComponent } from './service-list/service-list.component';

const routes: Routes = [
  {
    path: '',canActivate: [AuthGuard],
    component: ServiceListComponent
  },
  {
    path: 'create',canActivate: [AuthGuard],
    component: ServiceCreateComponent 
  },
  {
    path: ':id',canActivate: [AuthGuard],
    component: ServiceEditComponent    
  },
  {
    path: 'view/:id',canActivate: [AuthGuard],
    component: ServiceViewComponent    
  }
];
@NgModule({
  declarations: [
    ServiceEditComponent,
    ServiceViewComponent,
    ServiceCreateComponent,
    ServiceListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ShellComponentModule,  

    SharedModule,
    CoreModule
  ],
  
})
export class ServiceModule { }
