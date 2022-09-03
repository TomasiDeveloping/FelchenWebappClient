import { Component, OnInit } from '@angular/core';
import {AbstractControl, AsyncValidatorFn, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {of, timer} from "rxjs";
import {map, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loginForm: UntypedFormGroup | undefined;
  registerForm: UntypedFormGroup | undefined;

  constructor(private authService: AuthService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl(null, [Validators.required, Validators.email]),
      password: new UntypedFormControl(null, [Validators.required]),
    });
  }

  createRegisterForm() {
    this.registerForm = new UntypedFormGroup({
      email: new UntypedFormControl(null, [Validators.required, Validators.email, Validators.maxLength(100)], this.validateEmailNotTaken()),
      password: new UntypedFormControl(null, [Validators.required]),
      confirmPassword: new UntypedFormControl(null, [Validators.required, this.matchValues('password')]),
      firstName: new UntypedFormControl(null, [Validators.required, Validators.maxLength(100)]),
      lastName: new UntypedFormControl(null, [Validators.required, Validators.maxLength(100)])
    });
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return control => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.authService.checkEmailIfExists(control.value).pipe(
            map(res => {
              return res ? {emailExists: true} : null;
            })
          );
        })
      );
    };
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      // @ts-ignore
      return control?.value === control?.parent?.controls[matchTo].value
        ? null : {isMatching: true};
    };
  }

  onLogin() {
    if (this.loginForm?.invalid)
    {
      this.toastr.error('Fehler im Eingabefeld', 'Login');
      return;
    }
    // @ts-ignore
    this.authService.login(this.loginForm?.controls.email.value, this.loginForm?.controls.password.value);
  }

  onForgotPassword() {
    this.dialog.open(ForgotPasswordComponent, {
      width: '80%',
      height: 'auto'
    })
  }

  onIndexChange(index: number) {
    if (index === 0) {
      this.createLoginForm();
    }
    if (index === 1) {
      this.createRegisterForm();
    }
  }

  onRegister() {
    this.authService.register(this.registerForm?.value);
  }
}
