import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{

  title = 'FelchenApp WebClient';

  isLogin = false;
  private userSub: Subscription | undefined;

  constructor(private authService: AuthService) {
  }


  ngOnInit(): void {
    this.authService.autoLogin();
    this.userSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
      this.isLogin = isAuth;
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
