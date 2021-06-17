import { Component, OnInit } from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-version-description',
  templateUrl: './version-description.component.html',
  styleUrls: ['./version-description.component.css']
})
export class VersionDescriptionComponent implements OnInit {

  appVersion = environment.appVersion;

  constructor() { }

  ngOnInit(): void {
  }

  onVersion() {
    window.open('https://github.com/TomasiDeveloping/FelchenWebappClient', '_blank');
  }
}
