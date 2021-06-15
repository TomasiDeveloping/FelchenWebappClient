export interface ForeCastWeather {
      date: Date;
      sunrise: Date;
      sunset: Date;
      moon_phase: number;
      temp: {
        min: number;
        max: number;
      };
      pressure: number;
      humidity: number;
      wind_speed: number;
      description: string;
      icon: string;
      clouds: number;
      pop: number;
      rain: number;
      snow: number;
      uvi: number;
}

export interface CurrentWeather {
  description: string;
  icon: string;
  beauFord: number;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  visibility: number;
  windSpeed: number;
  clouds: number;
  rain: number;
  snow: number;
  date: Date;
  sunrise: Date;
  sunset: Date;
  cityName: string;
}



