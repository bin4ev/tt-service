import { NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";

import { MatIconModule } from "@angular/material/icon";
import { BUSSINES_PHONE_NUMBER, WORKING_TIME } from "../constants/constants";
import { TranslateModule } from "@ngx-translate/core";


@Component({
  selector: "app-footer",
  standalone: true,
  imports: [MatIconModule, NgOptimizedImage, TranslateModule],
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
  BUSSINES_PHONE_NUMBER = BUSSINES_PHONE_NUMBER;
  WORKING_TIME = WORKING_TIME;
}
