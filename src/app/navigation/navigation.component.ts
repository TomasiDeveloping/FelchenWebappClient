import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  private userSub: Subscription | undefined;
  currentUserName = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.currentUser.subscribe(currentUser => {
      if (currentUser?.firstName) {
        this.currentUserName = currentUser.firstName;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
  }
}
