import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
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

  fishCatchForm: FormGroup | undefined;
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
    this.fishCatchForm = new FormGroup({
      id: new FormControl(this.currentFishCatch.id),
      userId: new FormControl(this.currentFishCatch.userId),
      nymphName: new FormControl(this.currentFishCatch.nymphName),
      nymphColor: new FormControl(this.currentFishCatch.nymphColor),
      catchDate: new FormControl(new Date(this.currentFishCatch.catchDate).toISOString().substr(0, 10)),
      catchTime: new FormControl(new Date(this.currentFishCatch.catchDate)),
      hookSize: new FormControl(this.currentFishCatch.hookSize),
      nymphHead: new FormControl(this.currentFishCatch.nymphHead),
      lakeName: new FormControl(this.currentFishCatch.lakeName),
      deepLocation: new FormControl(this.currentFishCatch.deepLocation),
      deepFishCatch: new FormControl(this.currentFishCatch.deepFishCatch),
      waterTemperature: new FormControl(this.currentFishCatch.waterTemperature),
      weather: new FormControl(this.currentFishCatch.weather),
      airPressure: new FormControl(this.currentFishCatch.airPressure),
      windSpeed: new FormControl(this.currentFishCatch.windSpeed),
      airTemperature: new FormControl(this.currentFishCatch.airTemperature),
      allowPublic: new FormControl(this.currentFishCatch.allowPublic)
    });
  }

  onSubmit() {
    const fishCatch: FishCatch = this.fishCatchForm?.value as FishCatch;
    const date = new Date(this.fishCatchForm?.value.catchDate);
    const time = new Date(this.fishCatchForm?.value.catchTime);
    fishCatch.catchDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()));
    console.log(fishCatch);
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
