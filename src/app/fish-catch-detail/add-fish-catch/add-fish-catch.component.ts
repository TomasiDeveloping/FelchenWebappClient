import { Component, OnInit } from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {FishCatchService} from "../../services/fish-catch.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {FishCatch} from "../../models/fishCatch.model";
import {GeolocationService} from "@ng-web-apis/geolocation";
import {take} from "rxjs/operators";
import {WeatherService} from "../../services/weather.service";
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-add-fish-catch',
  templateUrl: './add-fish-catch.component.html',
  styleUrls: ['./add-fish-catch.component.css']
})
export class AddFishCatchComponent implements OnInit {

  currentUserId: number | undefined;
  fishCatchForm: UntypedFormGroup | undefined;
  latitude: number = 0;
  longitude: number = 0;
  currentAirPressure: number |undefined;
  currentWeather: string | undefined;
  currentAirTemperature: number | undefined;
  currentWindSpeed: number | undefined;
  currentLocation: string | undefined;
  currentWeatherDate: Date | undefined;

    constructor(private fishCatchService: FishCatchService,
              private toastr: ToastrService,
              private router: Router,
              private gelocationService: GeolocationService,
              private weatherService: WeatherService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    const token = localStorage.getItem('felchenToken');
    if (token) {
      const decodeToken: { email: string, nameid: string, exp: number } = jwt_decode.default(token);
      this.currentUserId = +decodeToken.nameid;
    }
    this.getGeolocation();
  }

  getGeolocation() {
      this.gelocationService.pipe(take(1)).subscribe((response) => {
        this.latitude = response.coords.latitude;
        this.longitude = response.coords.longitude;
        this.getCurrentWeather();
      }, error => {
        if (error.message === 'User denied Geolocation') {
          this.toastr.error('Standort wurde verweigert, keine Livedaten verfügbar', 'Standort');
        } else {
          this.toastr.error('Fehler beim Standort laden, keine Livedaten verfügbar', 'Standort');
        }
        this.createForm();
      });
  }

  getCurrentWeather() {
      this.weatherService.getCurrentWeatherByGeoLocation(this.latitude, this.longitude).subscribe(response => {
        this.currentAirPressure = response.pressure;
        this.currentWeather = response.description;
        this.currentAirTemperature = Math.round(response.temp * 10) /10;
        this.currentWindSpeed = Math.round(response.windSpeed * 10) / 10;
        this.currentLocation = response.cityName;
        this.currentWeatherDate = response.date;
        this.createForm();
      }, () => {
        this.toastr.error('Wetterdaten konnten nicht geladen werden', 'Live Wetterdaten');
        this.createForm();
      });
  }

  createForm() {
    this.fishCatchForm = new UntypedFormGroup({
      id: new UntypedFormControl(0),
      userId: new UntypedFormControl(this.currentUserId),
      nymphName: new UntypedFormControl(null),
      nymphColor: new UntypedFormControl(null),
      catchDate: new UntypedFormControl(new Date().toISOString().substr(0, 10)),
      catchTime: new UntypedFormControl(new Date()),
      hookSize: new UntypedFormControl(null),
      nymphHead: new UntypedFormControl(null),
      lakeName: new UntypedFormControl(null),
      deepLocation: new UntypedFormControl(null),
      deepFishCatch: new UntypedFormControl(null),
      waterTemperature: new UntypedFormControl(null),
      weather: new UntypedFormControl(this.currentWeather ? this.currentWeather : null),
      airPressure: new UntypedFormControl(this.currentAirPressure ? this.currentAirPressure : null),
      windSpeed: new UntypedFormControl(this.currentWindSpeed ? this.currentWindSpeed : null),
      airTemperature: new UntypedFormControl(this.currentAirTemperature ? this.currentAirTemperature : null),
      allowPublic: new UntypedFormControl(false),
      latitude: new UntypedFormControl(this.latitude ? this.latitude : null),
      longitude: new UntypedFormControl(this.longitude ? this.longitude : null)
    });
  }

  onSubmit() {
    const fishCatch: FishCatch = this.fishCatchForm?.value as FishCatch;
    const date = new Date(this.fishCatchForm?.value.catchDate);
    const time = new Date(this.fishCatchForm?.value.catchTime);
    fishCatch.catchDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()));
    this.fishCatchService.insertFishCatch(fishCatch).subscribe(result => {
      if (result) {
        this.toastr.success('Fang wurde hinzugefügt', 'Neuer Fang');
        this.router.navigate(['../home'], {relativeTo: this.route}).then();
      }
      else {
        this.toastr.error('Fang konnte nicht hinzugefügt werden', 'Neuer Fang');
      }
    }, error => {
      this.toastr.error(error.error, 'Neuer Fang');
    });
  }
}
