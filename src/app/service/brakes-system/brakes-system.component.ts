import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-brakes-system",
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatIconModule],

  templateUrl: "./brakes-system.component.html",
  styleUrl: "./brakes-system.component.scss",
})
export class BrakesSystemComponent {}
