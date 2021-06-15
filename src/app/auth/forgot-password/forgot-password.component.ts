import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup | undefined;

  constructor(private authService: AuthService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  onForgotPassword() {
    // @ts-ignore
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    const email = this.forgotPasswordForm?.controls.email.value;
    this.authService.forgotPassword(email).subscribe(response => {
      if (response) {
        this.toaster.success('Neues Passwort wurde per E-Mail gesendet', 'Neues Passwort');
      } else {
        this.toaster.error('Passwort konnte nicht zurückgesetzt werden', 'Neues Passwort');
      }
    }, error => {
      this.toaster.error(error.error, 'Neues Passwort');
    })
  }
}
