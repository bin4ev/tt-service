import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-brakes-system",
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatIconModule, TranslateModule],

  templateUrl: "./brakes-system.component.html",
  styleUrl: "./brakes-system.component.scss",
})
export class BrakesSystemComponent {}
