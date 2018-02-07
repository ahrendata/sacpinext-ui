import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ToastModule } from 'ng2-toastr';
import { SharedModule } from './shared/shared.module';
import { ConfigService, configServiceInitializer } from './config.service';
import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { AuthGuard } from './core/guard/auth.guard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ToastModule.forRoot(),   
    AppRoutingModule,
    SharedModule,
    CoreModule
  ],
  providers: [
    Configuration,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
