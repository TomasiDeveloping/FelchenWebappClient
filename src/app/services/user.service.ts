import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = environment.apiUrl + 'user/'

  constructor(private http: HttpClient) { }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(this.apiUrl + userId);
  }

  updateUser(userId: number, user: User): Observable<User> {
    return this.http.put<User>(this.apiUrl + userId, user);
  }

  changeUserPassword(userId: number, password: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl + 'changeuserpassword', {userId, password});
  }

  deleteUserById(userId: number): Observable<boolean> {
    return this.http.delete<boolean>(this.apiUrl + userId);
  }

}
