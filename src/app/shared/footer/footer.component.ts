import { NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";

import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import {
  BUSSINES_PHONE_NUMBER,
  WORKING_TIME,
  WORKING_TIME_WEEKEND,
} from "src/app/core/constants/constants";

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
  WORKING_TIME_WEEKEND = WORKING_TIME_WEEKEND;
}
