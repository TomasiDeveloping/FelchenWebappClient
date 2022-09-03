import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FishCatch} from "../../models/fishCatch.model";
import {BsLocaleService} from "ngx-bootstrap/datepicker";
import {defineLocale, deLocale} from "ngx-bootstrap/chronos";
import {FishCatchService} from "../../services/fish-catch.service";
import {ToastrService} from "ngx-toastr";

defineLocale('de', deLocale);

@Component({
  selector: 'app-edit-fish-catch',
  templateUrl: './edit-fish-catch.component.html',
  styleUrls: ['./edit-fish-catch.component.css']
})
export class EditFishCatchComponent implements OnInit {

  fishCatchForm: UntypedFormGroup | undefined;
  currentFishCatch: FishCatch;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private localeService: BsLocaleService,
              private fishCatchService: FishCatchService,
              private toastr: ToastrService,
              private dialogRef: MatDialogRef<EditFishCatchComponent>)
  {
    this.currentFishCatch = data.fishCatch;
  }

  ngOnInit(): void {
    this.localeService.use('de');
    this.createForm();
  }

  createForm() {
    this.fishCatchForm = new UntypedFormGroup({
      id: new UntypedFormControl(this.currentFishCatch.id),
      userId: new UntypedFormControl(this.currentFishCatch.userId),
      nymphName: new UntypedFormControl(this.currentFishCatch.nymphName),
      nymphColor: new UntypedFormControl(this.currentFishCatch.nymphColor),
      catchDate: new UntypedFormControl(new Date(this.currentFishCatch.catchDate).toISOString().substr(0, 10)),
      catchTime: new UntypedFormControl(new Date(this.currentFishCatch.catchDate)),
      hookSize: new UntypedFormControl(this.currentFishCatch.hookSize),
      nymphHead: new UntypedFormControl(this.currentFishCatch.nymphHead),
      lakeName: new UntypedFormControl(this.currentFishCatch.lakeName),
      deepLocation: new UntypedFormControl(this.currentFishCatch.deepLocation),
      deepFishCatch: new UntypedFormControl(this.currentFishCatch.deepFishCatch),
      waterTemperature: new UntypedFormControl(this.currentFishCatch.waterTemperature),
      weather: new UntypedFormControl(this.currentFishCatch.weather),
      airPressure: new UntypedFormControl(this.currentFishCatch.airPressure),
      windSpeed: new UntypedFormControl(this.currentFishCatch.windSpeed),
      airTemperature: new UntypedFormControl(this.currentFishCatch.airTemperature),
      allowPublic: new UntypedFormControl(this.currentFishCatch.allowPublic),
      latitude: new UntypedFormControl(this.currentFishCatch.latitude),
      longitude: new UntypedFormControl(this.currentFishCatch.longitude)
    });
  }

  onSubmit() {
    const fishCatch: FishCatch = this.fishCatchForm?.value as FishCatch;
    const date = new Date(this.fishCatchForm?.value.catchDate);
    const time = new Date(this.fishCatchForm?.value.catchTime);
    fishCatch.catchDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()));
    this.fishCatchService.updateFishCatch(fishCatch.id, fishCatch).subscribe(result => {
      if (result) {
        this.currentFishCatch = result;
        this.toastr.success('Fang erfolgreich geändert', 'Update Fang');
        this.dialogRef.close('Update');
      }
      else {
        this.toastr.error('Fang konnte nicht geändert werden', 'Update Fang')
      }
    }, error => {
      this.toastr.error(error.error, 'Update Fang')
    })
  }
}
