export interface ForecastWeather {
  date: Date;
  day: string;
  temperatureMax: number;
  temperatureMin: number;
  sunset: Date;
  sunrise: Date;
  description: string;
  rainProp: number;
  humidity: number;
  clouds: number;
  uv: number;
  airPressure: number;
  wind: number;
  rain: number;
  snow: number;
  icon: string;
}
