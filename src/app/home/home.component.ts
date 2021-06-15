import { Component, OnInit } from '@angular/core';
import {FishCatch} from "../models/fishCatch.model";
import {FishCatchService} from "../services/fish-catch.service";
import {PageChangedEvent} from "ngx-bootstrap/pagination";
import * as jwt_decode from "jwt-decode";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currentUserCatches: FishCatch[] = [];
  pageSize: number = 5;
  pageIndex: number = 1;
  totalCatches: number = 0;
  pageSizes: number[] = [3,5,10,15,20,50];
  sortBy = 'desc';

  publicCatches: FishCatch[] = [];
  totalPublicCatches: number = 0;
  publicPageSizes: number[] = [3,5,10,15,20];
  publicPageSize: number = 5;
  publicPageIndex: number = 1;

  currentUserId: number = 0;

  constructor(private fishCatchService: FishCatchService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('felchenToken');
    if (token) {
      const decodeToken: { email: string, nameid: string, exp: number } = jwt_decode.default(token);
      this.currentUserId = +decodeToken.nameid;
    }
    this.getUserCatches();
  }

  onIndexChange(index: number) {
    if (index === 0) {
      this.getUserCatches();
    }
    else {
      this.getPublicFishCatches();
    }
  }

  getUserCatches() {
    this.fishCatchService.getFishCatchByUserId(this.currentUserId, this.pageSize, this.pageIndex, this.sortBy).subscribe(result => {
      if (result) {
        this.currentUserCatches = result.fishCatches;
        this.totalCatches = result.totalFishCatches;
      }
    });
  }

  getPublicFishCatches() {
    this.fishCatchService.getPublicFishCatches(this.publicPageSize, this.publicPageIndex).subscribe(result => {
      if (result) {
        this.publicCatches = result.fishCatches;
        this.totalPublicCatches = result.totalPublicCatches;
      }
    })
  }

  onPageChange(event: PageChangedEvent) {
    this.pageSize = event.itemsPerPage;
    this.pageIndex = event.page;
    this.getUserCatches();
  }

  onPageSizeChange(event: number) {
    this.pageSize = +event;
    this.getUserCatches();
  }

  onSortChange(event: any) {
    this.sortBy = event;
    this.getUserCatches();
  }

  onPublicPageSizeChange(event: any) {
    this.publicPageSize = +event;
    this.getPublicFishCatches();
  }

  onPublicPageChange(event: PageChangedEvent) {
    this.publicPageSize = event.itemsPerPage;
    this.publicPageIndex = event.page;
    this.getPublicFishCatches();
  }
}
