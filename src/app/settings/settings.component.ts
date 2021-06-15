import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {environment} from "../../environments/environment";
import {MatDialog} from "@angular/material/dialog";
import {ContactComponent} from "./contact/contact.component";
import * as jwt_decode from "jwt-decode";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  currentUser: User | undefined;
  editUser = false;
  editPassword = false;
  editUserForm: FormGroup | undefined;
  changePasswordForm: FormGroup | undefined;
  appVersion = environment.appVersion;
  currentYear = new Date();
  currentUserId = 0;

  constructor(private userService: UserService, private dialog: MatDialog, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('felchenToken');
    if (token) {
      const decodeToken: { email: string, nameid: string, exp: number } = jwt_decode.default(token);
      this.currentUserId = +decodeToken.nameid;
    }
    this.getUser();
  }

  private getUser() {
    this.userService.getUserById(this.currentUserId).subscribe(response => {
      this.currentUser = response;
    });
  }

  changeUser() {
    this.editUser = true;
    this.createEditUserForm();
  }

  createEditUserForm() {
    this.editUserForm = new FormGroup({
      id: new FormControl(this.currentUser?.id),
      firstName: new FormControl(this.currentUser?.firstName, [Validators.required, Validators.maxLength(100)]),
      lastName: new FormControl(this.currentUser?.lastName, [Validators.required, Validators.maxLength(100)]),
      email: new FormControl(this.currentUser?.email, [Validators.required, Validators.email]),
      createdAt: new FormControl(this.currentUser?.createdAt),
      isActive: new FormControl(this.currentUser?.isActive)
    });
  }
  createChangePasswordForm() {
    this.changePasswordForm = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required, this.matchValues('password')])
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      // @ts-ignore
      return control?.value === control?.parent?.controls[matchTo].value
        ? null : {isMatching: true};
    };
  }

  onChangeUser() {
    // @ts-ignore
    if (this.editUserForm.invalid) {
      this.toastr.error('Fehler', 'Update User');
      return;
    }
    const user: User = this.editUserForm?.value as User;
    this.userService.updateUser(user.id, user).subscribe(response => {
      this.currentUser = response;
      this.editUser = false;
      this.toastr.success('Daten geändert', 'Update User');
    }, error => {
      this.toastr.error(error.error, 'Update User');
    })
  }

  changePassword() {
    this.editPassword = true;
    this.createChangePasswordForm();
  }

  onChangePassword() {
    // @ts-ignore
    if (this.changePasswordForm.invalid) {
      return;
    }
    const password = this.changePasswordForm?.controls.password.value;
    // @ts-ignore
    this.userService.changeUserPassword(this.currentUserId, password).subscribe(response => {
      if (response) {
        Swal.fire('Neues Passwort', 'Passwort erfolgreich geändert, Du wirst automatisch ausgeloggt.', 'success')
          .then(() => this.authService.logout());
      }
    }, error => {
      this.toastr.error(error.error, 'Passwort ändern');
    });
  }

  onContact() {
    this.dialog.open(ContactComponent, {
      width: '80%',
      height: 'auto',
      data: {email: this.currentUser?.email}
    })
  }

  onDeleteAccount() {
    Swal.fire({
      title: 'Account löschen',
      text: this.currentUser?.firstName + ' möchtest Du dein Account wirklich löschen ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Abbrechen',
      confirmButtonText: 'Ja, bitte löschen'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Bist Du sicher ?',
          text: 'Alle Daten und fänge werden unwiederruflich gelöscht !',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ja, alles löschen',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Abbrechen'
        }).then((conf) =>{
          if (conf.isConfirmed) {
            // @ts-ignore
            this.userService.deleteUserById(this.currentUser.id).subscribe(response => {
              if (response) {
                Swal.fire('Account gelöscht', 'Dein Account wurde gelöscht', 'success')
                  .then(() => this.authService.logout());
              } else {
                this.toastr.error('Account konnte niht gelöscht werden', 'Account löschen');
              }
            }, error => {
              this.toastr.error(error.error, 'Account löschen')
            })
          }
        })
      }
    })
  }
}
