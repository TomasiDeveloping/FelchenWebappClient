export interface FishCatch {
  id: number;
  userId: number;
  catchDate: Date,
  nymphName: string;
  nymphColor: string;
  hookSize: number;
  nymphHead: string;
  lakeName: string;
  deepLocation: number;
  deepFishCatch: number;
  waterTemperature: number;
  weather: string;
  airPressure: number;
  windSpeed: number;
  airTemperature: number;
  allowPublic: boolean
}
