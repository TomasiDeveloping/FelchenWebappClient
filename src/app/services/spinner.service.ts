import { Injectable } from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  busyRequestCount = 0;

  constructor(private spinnerService: NgxSpinnerService) { }

  busy(): void {
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'square-spin',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: 'gold'
    });
  }

  idle(): void {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
