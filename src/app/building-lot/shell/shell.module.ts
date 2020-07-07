import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../../core/core.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { ShellContentComponent } from './shell-content/shell-content.component';
import { ShellHeaderComponent } from './shell-header/shell-header.component';
import { ShellSidebarComponent } from './shell-sidebar/shell-sidebar.component';
import { ShellFooterComponent } from './shell-footer/shell-footer.component';
import { AboutModalModule1 } from '../ui/about-modal/about-modal.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    CoreModule,
    AboutModalModule1
  ],
  declarations: [
    ShellContentComponent,
    ShellHeaderComponent, 
    ShellSidebarComponent, 
    ShellFooterComponent
  ],
  exports:[
    ShellContentComponent,
    ShellHeaderComponent, 
    ShellSidebarComponent,
    ShellFooterComponent
  ]
})
export class ShellComponentModule { }
