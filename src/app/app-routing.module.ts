import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {FishCatchDetailComponent} from "./fish-catch-detail/fish-catch-detail.component";
import {AddFishCatchComponent} from "./fish-catch-detail/add-fish-catch/add-fish-catch.component";
import {WeatherComponent} from "./weather/weather.component";
import {SettingsComponent} from "./settings/settings.component";


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'addCatch', component: AddFishCatchComponent},
  {path: 'wetter', component: WeatherComponent},
  {path: 'details/:id', component: FishCatchDetailComponent},
  {path: 'settings', component: SettingsComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
