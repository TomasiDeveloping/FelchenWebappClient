import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CurrentWeather, ForeCastWeather} from "../models/weather.model";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  cachedWeatherForeCast: ForeCastWeather [] = [];
  cachedCurrentWeather: CurrentWeather | null = null;
  weatherApiUrl = 'https://api.openweathermap.org/data/2.5/';
  weatherApiKey = environment.weatherApiKey;


  constructor(private http: HttpClient) { }

  makeOneCallRequest(latitude: number, longitude: number): Observable<ForeCastWeather[]> {
    let params = new HttpParams();
    params = params.set('lat', latitude);
    params = params.set('lon', longitude);
    params = params.set('appid', this.weatherApiKey);
    params = params.set('units', 'metric');
    params = params.set('exclude', 'minutely,alerts');
    params = params.set('lang', 'de');
    return this.http.get<any>(this.weatherApiUrl + 'onecall', {params: params}).pipe(map(result => {
      result.daily.forEach((res: any) => {
        this.cachedWeatherForeCast.push(new class implements ForeCastWeather {
          clouds = res.clouds;
          date = new Date(res.dt * 1000);
          description = res.weather[0].description;
          humidity = res.humidity;
          icon = res.weather[0].icon;
          moon_phase = res.moon_phase;
          pop = res.pop * 100;
          pressure = res.pressure;
          rain = res.rain ? res.rain : 0;
          snow = res.snow ? res.snow : 0;
          sunrise = new Date(res.sunrise * 1000);
          sunset = new Date(res.sunset * 1000);
          temp = { min: res.temp.min, max: res.temp.max };
          uvi = res.uvi;
          wind_speed = res.wind_speed * 3.6;
        })
      })
      return this.cachedWeatherForeCast;
    }));
  }

  getCurrentWeatherByGeoLocation(latitude: number, longitude: number): Observable<CurrentWeather> {
    let params = new HttpParams();
    params = params.set('lat', latitude ? latitude : 0);
    params = params.set('lon', longitude ? longitude : 0);
    params = params.set('appid', this.weatherApiKey);
    params = params.set('lang', 'de');
    params = params.set('units', 'metric');
    return this.http.get<any>(this.weatherApiUrl + 'weather', {params: params}).pipe(map(result => {
      this.cachedCurrentWeather = new class implements CurrentWeather {
        beauFord =  WeatherService.getBeauFord(result.wind.speed);
        clouds =  result.clouds.all;
        date = new Date(result.dt * 1000);
        temp = result.main.temp;
        feels_like= result.main.feels_like;
        temp_min = result.main.temp_min;
        temp_max =  result.main.temp_max;
        pressure = result.main.pressure;
        humidity = result.main.humidity;
        cityName = result.name;
        rain = result.rain ? result.rain["1h"] : 0;
        snow = result.snow ? result.snow["1h"] : 0;
        sunrise = new Date(result.sys.sunrise * 1000);
        sunset = new Date(result.sys.sunset * 1000);
        visibility = result.visibility / 1000;
        description =  result.weather[0].description;
        icon = result.weather[0].icon;
        windSpeed = result.wind.speed * 3.6
      }
      return this.cachedCurrentWeather;
    }));
  }

  getCurrentCachedWeather() {
    return this.cachedCurrentWeather;
  }

  getCachedForeCastWeather() {
    return this.cachedWeatherForeCast;
  }

  private static getBeauFord(wind: number) {
    wind = wind * 3.6;
    if (wind < 1) {
      return  0;
    } else if (wind > 1 && wind <= 5)  {
      return 1;
    } else if (wind > 5 && wind <= 11) {
      return  2;
    } else if (wind > 11 && wind <= 19) {
      return 3;
    } else if (wind > 19 && wind <= 28) {
      return 4;
    } else if (wind > 28 && wind <= 38) {
      return 5;
    } else if (wind > 38 && wind <= 49) {
      return 6;
    } else if (wind > 49 && wind <= 61) {
      return 7;
    } else if (wind > 61 && wind <= 74) {
      return 8;
    } else if (wind > 74 && wind <= 88) {
      return 9;
    } else if (wind > 88 && wind <= 102) {
      return 10;
    } else if (wind > 102 && wind <= 117) {
      return 11;
    } else if (wind > 177) {
      return 12;
    }
    return -1;
  }
}
