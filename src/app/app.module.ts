import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import {NgxNavbarModule} from "ngx-bootstrap-navbar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import {MatTabsModule} from "@angular/material/tabs";
import { FishCatchDetailComponent } from './fish-catch-detail/fish-catch-detail.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { EditFishCatchComponent } from './fish-catch-detail/edit-fish-catch/edit-fish-catch.component';
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {TimepickerModule} from "ngx-bootstrap/timepicker";
import {ToastrModule} from "ngx-toastr";
import { AddFishCatchComponent } from './fish-catch-detail/add-fish-catch/add-fish-catch.component';
import {PaginationModule} from "ngx-bootstrap/pagination";
import { WeatherComponent } from './weather/weather.component';
import { AuthComponent } from './auth/auth.component';
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import { SettingsComponent } from './settings/settings.component';
import { ContactComponent } from './settings/contact/contact.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {SpinnerInterceptor} from "./interceptors/spinner.interceptor";
import {JwtInterceptor} from "./interceptors/jwt.interceptor";
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    FishCatchDetailComponent,
    EditFishCatchComponent,
    AddFishCatchComponent,
    WeatherComponent,
    AuthComponent,
    SettingsComponent,
    ContactComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxNavbarModule,
    BrowserAnimationsModule,
    MatTabsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    NgxSpinnerModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    TimepickerModule.forRoot(),
    PaginationModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    })
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
