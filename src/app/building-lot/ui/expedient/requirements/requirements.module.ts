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
import { RequirementViewComponent } from './requirement-view/requirement-view.component';

const routes: Routes = [
  {
    path: '',canActivate: [AuthGuard],
    component: RequirementListComponent
  },
  {
    path: 'create',canActivate: [AuthGuard],
    component: RequirementCreateComponent 
  },
  {
    path: ':id',canActivate: [AuthGuard],
    component: RequirementEditComponent    
  },
  {
    path: 'view/:id',canActivate: [AuthGuard],
    component: RequirementViewComponent    
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
    RequirementListComponent, 
    RequirementViewComponent
  ]
})
export class RequirementModule { }

