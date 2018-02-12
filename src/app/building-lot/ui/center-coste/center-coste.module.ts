import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenterCosteComponent } from './center-coste.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../core/guard/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: CenterCosteComponent }
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
  declarations: [CenterCosteComponent],
  exports: [CenterCosteComponent]
})
export class CenterCosteModule { }
