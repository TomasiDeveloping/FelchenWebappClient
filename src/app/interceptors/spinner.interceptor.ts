import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {finalize} from "rxjs/operators";
import {SpinnerService} from "../services/spinner.service";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private spinnerService: SpinnerService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.includes('CheckEmailExists')) {
      return next.handle(req);
    }
    this.spinnerService.busy();
    return next.handle(req).pipe(
      finalize(() => {
        this.spinnerService.idle();
      })
    );
  }
}
