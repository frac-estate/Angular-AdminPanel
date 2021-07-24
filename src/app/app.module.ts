import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { FakeBackendProvider } from './core/helpers/fake-backend';

//import { LayoutsModule } from './layouts/layouts.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ConfigService } from './config.service';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Ng5SliderModule } from 'ng5-slider';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup

import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting

import { NgxSpinnerModule } from "ngx-spinner";

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

const appInitializerFn = (configService: ConfigService) => {
  return () => {
    return configService.setConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgSelectModule,
    FormsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    Ng5SliderModule,
    MomentModule,
    NgIdleKeepaliveModule.forRoot(),
    NgxSpinnerModule,
    NgbModule
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [ConfigService]
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    FakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
