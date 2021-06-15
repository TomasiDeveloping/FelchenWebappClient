import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FishCatchService} from "../services/fish-catch.service";
import {FishCatch} from "../models/fishCatch.model";
import Swal from 'sweetalert2';
import {MatDialog} from "@angular/material/dialog";
import {EditFishCatchComponent} from "./edit-fish-catch/edit-fish-catch.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-fish-catch-detail',
  templateUrl: './fish-catch-detail.component.html',
  styleUrls: ['./fish-catch-detail.component.css']
})
export class FishCatchDetailComponent implements OnInit {

  currentFishCatch: FishCatch | undefined;
  currentFishCatchId: number = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fishCatchService: FishCatchService,
              private toastr: ToastrService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.router.navigate(['/home'], {relativeTo: this.route}).then();
      }
      // @ts-ignore
      this.currentFishCatchId = +paramMap.get('id');
      this.getFishCatch();
    })
  }

  getFishCatch() {
    this.fishCatchService.getFishCatchById(this.currentFishCatchId).subscribe(response => {
      this.currentFishCatch = response;
    });
  }
  onBack() {
    this.router.navigate(['/home'], {relativeTo: this.route}).then();
  }

  onDelete(fishCatchId: number) {
    Swal.fire({
      title: 'Fang löschen?',
      text: "Diesen Fang wirklich löschen ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Abbrechen',
      confirmButtonText: 'Ja, löschen!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.fishCatchService.deleteFishCatch(fishCatchId).subscribe(response => {
          if (response) {
            this.toastr.success('Fang wurde gelöscht', 'Fang löschen');
            this.router.navigate(['/home'], {relativeTo: this.route}).then();
          } else {
            this.toastr.error('Fang konnte nicht gelöscht werden', 'Fang löschen');
          }
        }, error => {
          this.toastr.error(error.error, 'Fang löschen')
        });
      }
    })
  }

  onEdit() {
    const dialogRef = this.dialog.open(EditFishCatchComponent, {
      width: '80%',
      height: 'auto',
      data: {fishCatch: this.currentFishCatch}
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Update') {
        this.getFishCatch();
      }
    });
  }
}
