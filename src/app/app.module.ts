import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RestangularModule } from 'ngx-restangular';
import { BsDropdownModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ToastModule } from 'ng6-toastr';
import { SharedModule } from './shared/shared.module';
import { ToastNotificationModule } from 'patternfly-ng';

import { ConfigService, configServiceInitializer } from './config.service';
import { AppComponent } from './app.component';
import { AuthGuard } from './core/guard/auth.guard';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

export function restangularProviderConfigurer(restangularProvider: any, config: ConfigService) {
  restangularProvider.setBaseUrl(config.getSettings().apiEndpoint);
}


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
    ToastNotificationModule,
    BrowserAnimationsModule,
    RestangularModule.forRoot([ConfigService], restangularProviderConfigurer),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ToastModule.forRoot(),
    TooltipModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    CoreModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceInitializer,
      deps: [ConfigService],
      multi: true,
    },
    //Configuration,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
