import { AuthGuard } from './../../../../core/guard/auth.guard';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { ShellComponentModule } from './../../../shell/shell.module';

import { RequirementCreateComponent } from './requirement-create/requirement-create.component';
import { RequirementEditComponent } from './requirement-edit/requirement-edit.component';
import { RequirementListComponent } from './requirement-list/requirement-list.component';

//import { SacpiResolverService } from '../../../../core/resolvers/sacpi-resolver.service';

const routes: Routes = [
  {
    path: '',canActivate: [AuthGuard],
    component: RequirementListComponent
  },
  {
    path: 'create',
    component: RequirementCreateComponent 
  },
  {
    path: ':document',
    component: RequirementEditComponent
    // resolve: {
    //   document: SacpiResolverService
    // }
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
    CoreModule
  ],
  declarations: [
    RequirementCreateComponent, 
    RequirementEditComponent, 
    RequirementListComponent
  ]
})
export class RequirementModule { }
