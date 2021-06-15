import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreService} from "../../services/core.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  supportMailForm: FormGroup | undefined;
  userEmail: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private coreService: CoreService, private toastr: ToastrService, private dialogRef: MatDialogRef<ContactComponent>)
  {
    this.userEmail = data.email;
  }

  ngOnInit(): void {
    this.createContactForm();
  }

  createContactForm() {
    this.supportMailForm = new FormGroup({
      email: new FormControl(this.userEmail, [Validators.required, Validators.email]),
      message: new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    // @ts-ignore
    if (this.supportMailForm.invalid) {
      return;
    }
    const contact: {email: string, message: string} = this.supportMailForm?.value;
    this.coreService.sendContactMail(contact.email, contact.message).subscribe(response => {
      if (response) {
        this.dialogRef.close();
        this.toastr.success('Besten Dank für deine Nachricht, ich melde mich schnellstmöglich', 'Kontakt Suppoort');
      } else {
        this.toastr.error('Email konnte nicht gesendet werden', 'Kontakt Support');
      }
    }, error => {
      this.toastr.error(error.error, 'Kontakt Support');
    });
  }
}
