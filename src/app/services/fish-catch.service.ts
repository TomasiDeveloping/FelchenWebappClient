import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {FishCatch} from "../models/fishCatch.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FishCatchService {

  private apiUrl = environment.apiUrl + 'FishCatch/';

  constructor(private http: HttpClient) { }

  getPublicFishCatches(pageSize: number, pageIndex: number): Observable<{fishCatches: FishCatch[], totalPublicCatches: number}> {
    let params = new HttpParams();
    params = params.set('pageSize', pageSize.toString());
    params = params.set('pageIndex', pageIndex.toString());
    return this.http.get<{fishCatches: FishCatch[], totalPublicCatches: number}>(this.apiUrl + 'GetPublicFishCatches', {params: params});
  }

  getFishCatchByUserId(userId: number, pageSize: number, pageIndex: number, sortBy: string): Observable<{ fishCatches: FishCatch[], totalFishCatches: number }> {
    let params = new HttpParams();
    params = params.set('pageSize', pageSize.toString());
    params = params.set('pageIndex', pageIndex.toString());
    params = params.set('sortBy', sortBy);
    return this.http.get<{ fishCatches: FishCatch[], totalFishCatches: number }>(this.apiUrl + 'Users/' + userId, {params: params});
  }

  getFishCatchById(fishCatchId: number): Observable<FishCatch> {
    return this.http.get<FishCatch>(this.apiUrl + fishCatchId);
  }

  insertFishCatch(fishCatch: FishCatch): Observable<FishCatch> {
    return this.http.post<FishCatch>(this.apiUrl, fishCatch);
  }

  updateFishCatch(fishCatchId: number, fishCatch: FishCatch): Observable<FishCatch> {
    return this.http.put<FishCatch>(this.apiUrl + fishCatchId, fishCatch);
  }

  deleteFishCatch(fishCatchId: number): Observable<boolean> {
    return this.http.delete<boolean>(this.apiUrl + fishCatchId);
  }
}
