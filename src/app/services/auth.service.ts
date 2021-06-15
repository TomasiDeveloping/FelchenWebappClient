import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AppUser} from "../models/appUser.model";
import {BehaviorSubject, Observable} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {map} from "rxjs/operators";
import Swal from "sweetalert2";
import * as jwt_decode from "jwt-decode";
import {UserService} from "./user.service";
import {Register} from "../models/register.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl + 'auth/'
  currentUserSource = new BehaviorSubject<AppUser | null>(null);

  constructor(private http: HttpClient, private toastr: ToastrService, private userService: UserService) { }

  get userIsAuthenticated() {
    return this.currentUserSource.asObservable().pipe(map(appUser => {
      if (appUser) {
        return !!appUser.token;
      }
      return false;
    }));
  }

  get currentUser() {
    return this.currentUserSource.asObservable();
  }

  login(email: string, password: string) {
    this.http.post<AppUser>(this.apiUrl + 'Login', {email, password}).subscribe(response => {
      this.currentUserSource.next(response);
      AuthService.setUserData(response);
    }, error => {
      this.toastr.error(error.error, 'Login');
    });
  }

  register(register: Register) {
    this.http.post<AppUser>(this.apiUrl + 'Register', register).subscribe(response => {
      this.currentUserSource.next(response);
      AuthService.setUserData(response);
    }, error => {
      this.toastr.error(error.error, 'Registrieren')
    })
  }

  autoLogin() {
    const token = localStorage.getItem('felchenToken');
    if (token) {
      const decodeToken: { email: string, nameid: string, exp: number } = jwt_decode.default(token);
      const expiryDate = new Date(decodeToken.exp * 1000);
      if (expiryDate < new Date()) {
        Swal.fire('Session', 'Die Sitzung ist abgelaufen, bitte melden Sie sich erneut an', 'info')
          .then(() => this.logout());
      }
      const userId = +decodeToken.nameid;
      this.userService.getUserById(userId).subscribe(response => {
        const appUser: AppUser = new class implements AppUser {
          userId = response.id;
          token = token ? token : '';
          firstName = response.firstName
        }
        this.currentUserSource.next(appUser);
      });
    }
  }

  logout() {
    AuthService.removeUserData();
    this.currentUserSource.next(null);
  }

  forgotPassword(email: string): Observable<boolean> {
    let params = new HttpParams();
    params = params.set('email', email);
    return this.http.get<boolean>(this.apiUrl + 'forgotPassword', {params: params});
  }

  checkEmailIfExists(email: string): Observable<boolean> {
    let params = new HttpParams();
    params = params.set('email', email);
    return this.http.get<boolean>(this.apiUrl + 'CheckEmailExists', {params: params});
  }

  private static setUserData(appUser: AppUser) {
    localStorage.setItem('felchenToken', appUser.token);
  }

  private static removeUserData() {
    localStorage.removeItem('felchenToken');
  }
}
