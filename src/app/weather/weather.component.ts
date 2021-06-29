import { Component, OnInit } from '@angular/core';
import {CurrentWeather, ForeCastWeather} from "../models/weather.model";
import {WeatherService} from "../services/weather.service";
import {GeolocationService} from "@ng-web-apis/geolocation";
import {take} from "rxjs/operators";
import {MoonPhase} from "../models/moonPhase.model";
import {ToastrService} from "ngx-toastr";



@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  currentWeather: CurrentWeather | null = null;
  moonPhase: MoonPhase[] = [];
  sevenDayForecast: boolean = false;
  showMoonPhase = false;
  forecastWeather: ForeCastWeather[] = [];
  errorMessage = '';

  constructor(private weatherService: WeatherService,
              private geoLocationService: GeolocationService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.currentWeather = this.weatherService.getCurrentCachedWeather();
    if (!this.currentWeather) {
      this.getCurrentWeatherWithCord();
    }
  }
  getCurrentWeatherWithCord() {
    this.geoLocationService.pipe(take(1)).subscribe(response => {
      if (response) {
        this.weatherService.getCurrentWeatherByGeoLocation(response.coords.latitude, response.coords.longitude).subscribe(result => {
          this.currentWeather = result;
        }, () => {
          this.errorMessage = 'Wetterdaten konnten nicht geladen werden. Versuche es später nochmals.';
        });
      }
    }, error => {
      if (error.message === 'User denied Geolocation') {
        this.errorMessage = 'Geolocation wurde verweigert';
      } else {
        this.errorMessage = error.message;
      }
    });
  }

  onMoonClick() {
    this.showMoonPhase = !this.showMoonPhase;
    this.forecastWeather = this.weatherService.getCachedForeCastWeather();
    if (this.forecastWeather.length < 1) {
      this.geoLocationService.pipe(take(1)).subscribe(response => {
        this.weatherService.makeOneCallRequest(response.coords.latitude, response.coords.longitude).subscribe(result => {
          for (let i = 0; i < 7; i++) {
            this.moonPhase.push({
              day: this.getDay(result[i].date.getDay()),
              phase: result[i].moon_phase
            })
          }
          this.forecastWeather = result;
        }, () => {
          this.toastr.error('Wetterdaten konnten nicht geladen werden', 'Wetter');
        });
      }, error => {
        if (error.message === 'User denied Geolocation') {
          this.toastr.error('Geolocation wurde verweigert', 'Wetter');
        } else {
          this.toastr.error(error.message, 'Wetter');
        }
      });
    } else {
      if (this.moonPhase.length < 1) {
        for (let i = 0; i < 7; i++) {
          this.moonPhase.push({
            day: this.getDay(this.forecastWeather[i].date.getDay()),
            phase: this.forecastWeather[i].moon_phase
          })
        }
      }
    }

  }

  getDay(day: number): string {
    switch (day) {
      case 0: return 'So.'
      case 1: return 'Mo.'
      case 2: return 'Di.'
      case 3: return 'Mi.'
      case 4: return 'Do.'
      case 5: return 'Fr.'
      case 6: return 'Sa.'
      default: return ''
    }
  }
  getDayName(day: number): string {
    switch (day) {
      case 0: return 'Sonntag'
      case 1: return 'Montag'
      case 2: return 'Dienstag'
      case 3: return 'Mittwoch'
      case 4: return 'Donnerstag'
      case 5: return 'Freitag'
      case 6: return 'Samstag'
      default: return ''
    }
  }
  getMoonPictures(phase: number): string {
    if (phase === 0 || phase === 1) {
      return '../assets/moon/new-moon.png';
    }
    if (phase > 0.01 && phase < 0.24) {
      return '../assets/moon/waxing-crescent-moon.png';
    }
    if (phase === 0.25) {
      return '../assets/moon/first-quarter-moon.png'
    }
    if (phase > 0.26 && phase < 0.49) {
      return '../assets/moon/waxing-gibbous-moon.png'
    }
    if (phase === 0.5) {
      return '../assets/moon/full-moon.png'
    }
    if (phase > 0.51 && phase < 0.74) {
      return '../assets/moon/waning-gibbous-moon.png'
    }
    if (phase === 0.75) {
      return '../assets/moon/last-quarter-moon.png'
    }
    if (phase > 0.76 && phase < 0.99) {
      return '../assets/moon/waning-crescent-moon.png'
    }
    return '';
  }

  onLoadForecast() {
    this.sevenDayForecast = !this.sevenDayForecast;
    this.forecastWeather = this.weatherService.getCachedForeCastWeather();
    if (this.forecastWeather.length < 1) {
      this.geoLocationService.pipe(take(1)).subscribe(response => {
        this.weatherService.makeOneCallRequest(response.coords.latitude, response.coords.longitude).subscribe(result => {
          for (let i = 0; i < 7; i++) {
            this.moonPhase.push({
              day: this.getDay(result[i].date.getDay()),
              phase: result[i].moon_phase
            })
          }
          this.forecastWeather = result;
        }, () => {
          this.toastr.error('Wetterdaten konnten nicht geladen werden', 'Wetter');
        });
      }, error => {
        if (error.message === 'User denied Geolocation') {
          this.toastr.error('Geolocation wurde verweigert', 'Wetter');
        } else {
          this.toastr.error(error.message, 'Wetter');
        }
      });
    }
  }

  getUvIndexColor(uvTet: number): any {
    uvTet = Math.round(uvTet);
    if (uvTet <= 2) return 'lime';
    else if (uvTet > 2 && uvTet <= 5) return 'yellow';
    else if (uvTet > 5 && uvTet <= 7) return 'orange';
    else if (uvTet > 7 && uvTet <= 10) return 'red';
    else return 'violet';
  }

  getBeaufortColor(beaufort: number | undefined) {
    if (beaufort === 0) return 'darkgrey';
    else if (beaufort === 1) return 'lightblue';
    else if (beaufort === 2 || beaufort === 3) return 'lightgreen';
    else if (beaufort === 4 || beaufort === 5) return 'limegreen';
    else if (beaufort === 6 || beaufort === 7) return 'yellow';
    else if (beaufort === 8 || beaufort === 9) return 'orange';
    else if (beaufort === 10 || beaufort === 11) return 'orangered';
    else if (beaufort === 12) return 'red';
    else return '';
  }
  getBeaufortDescription(beauFord: number | undefined) {
    switch (beauFord) {
      case 0: return 'Windstille';
      case 1: return 'Leiser Zug';
      case 2: return 'Leichte Brise';
      case 3: return 'Schwache Brise';
      case 4: return 'Mässige Brise';
      case 5: return 'Frische Brise';
      case 6: return 'Starker Wind';
      case 7: return 'Steifer Wind';
      case 8: return 'Stürmischer Wind';
      case 9: return 'Sturm';
      case 10: return 'Schwerer Sturm';
      case 11: return 'Orkanartiger Sturm';
      case 12: return 'Orkan';
      default: return '';
    }
  }
}

