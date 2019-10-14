import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenterCosteComponent } from './center-coste.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../core/guard/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { CenterCosteFilesComponent } from './center-coste-files/center-coste-files.component';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: CenterCosteComponent },
  { path: 'cc-files', canActivate: [AuthGuard], component: CenterCosteFilesComponent }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),

    SharedModule,
    CoreModule,
    NgSelectModule
  ],
  declarations: [CenterCosteComponent, CenterCosteFilesComponent],
  exports: [CenterCosteComponent,CenterCosteFilesComponent]
})
export class CenterCosteModule { }
