
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../../shared/shared.module';
import { ShellComponentModule } from './../shell/shell.module';

import { AuthGuard } from './../../core/guard/auth.guard';

import { SacpiUIComponent } from './ui.component';
import { SingInComponent } from './sing-in/sing-in.component';

const routes: Routes = [
  {
    path: 'login',
    component: SingInComponent
  },
  {
    path: '', canActivate: [AuthGuard],
    component: SacpiUIComponent,
    children: [
      { path: '', redirectTo: 'expedients', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: 'app/building-lot/ui/dashboard/dashboard.module#DashboardModule' },
      { path: 'center-coste', loadChildren: 'app/building-lot/ui/center-coste/center-coste.module#CenterCosteModule' },
      { path: 'expedients', loadChildren: 'app/building-lot/ui/expedient/expedient.module#ExpedientModule' },
      { path: 'acount', loadChildren: 'app/building-lot/ui/acount/acount.module#AcountModule' },
      { path: 'change-password', loadChildren: 'app/building-lot/ui/change-password/change-password.module#ChangePasswordModule' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShellComponentModule,
    SharedModule
  ],
  exports: [
    RouterModule,
    SingInComponent
  ],
  declarations: [
    SacpiUIComponent,
    SingInComponent
  ],
  providers: [
    AuthGuard
  ]
})
export class SacpiUIModule { }
