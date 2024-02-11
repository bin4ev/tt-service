import { Component } from "@angular/core";

import { MatToolbarModule } from "@angular/material/toolbar";
import { NgOptimizedImage } from '@angular/common'
import { RouterLink, RouterLinkActive } from "@angular/router";


@Component({
  selector: "app-header",
  standalone: true,
  imports: [MatToolbarModule, NgOptimizedImage, RouterLink, RouterLinkActive],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {}
