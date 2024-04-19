import { NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";

import { MatIconModule } from "@angular/material/icon";
import { BUSSINES_PHONE_NUMBER } from "../constants/constants";


@Component({
  selector: "app-footer",
  standalone: true,
  imports: [MatIconModule, NgOptimizedImage],
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
  BUSSINES_PHONE_NUMBER = BUSSINES_PHONE_NUMBER
}
