import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard } from './../../../../core/guard/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { ShellComponentModule } from './../../../shell/shell.module';

import { RegistryCreateComponent } from './registry-create/registry-create.component';
import { RegistryEditComponent } from './registry-edit/registry-edit.component';
import { RegistryListComponent } from './registry-list/registry-list.component';
import { RegistryViewComponent } from './registry-view/registry-view.component';

const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard],
    component: RegistryListComponent
  },
  {
    path: 'create', canActivate: [AuthGuard],
    component: RegistryCreateComponent
  },
  {
    path: ':id', canActivate: [AuthGuard],
    component: RegistryEditComponent
  },
  {
    path: 'view/:id', canActivate: [AuthGuard],
    component: RegistryViewComponent
  }
];


@NgModule({
  declarations: [RegistryCreateComponent, RegistryEditComponent, RegistryListComponent, RegistryViewComponent],
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
export class RegistryModule { }
