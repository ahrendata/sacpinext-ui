import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../../../core/core.module';
import { ShellComponentModule } from './../../shell/shell.module';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  { path: '', redirectTo: 'registry', pathMatch: 'full' },  {
    path: 'registry',
    loadChildren: 'app/building-lot/ui/sctr/registry/registry.module#RegistryModule'
  }
];

@NgModule({
  declarations: [],
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
export class SctrModule { }
