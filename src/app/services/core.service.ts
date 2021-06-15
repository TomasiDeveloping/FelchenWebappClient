import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  apiUrl = environment.apiUrl + 'service/'

  constructor(private http: HttpClient) { }

  sendContactMail(email: string, message: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl + 'sendContactMail', {email, message});
  }
}
