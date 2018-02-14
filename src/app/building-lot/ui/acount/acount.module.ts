import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcountComponent } from './acount.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../core/guard/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: AcountComponent }
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
  declarations: [AcountComponent],
  exports: [AcountComponent]
})
export class AcountModule { }
