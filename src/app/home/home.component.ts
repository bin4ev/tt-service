import { Component, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { animate, style, transition, trigger } from "@angular/animations";
import { JsmapComponent } from "../jsmap/jsmap.component";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, MatButtonModule, JsmapComponent, MatCardModule, RouterLink],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateX(-100%)" }),
        animate("1000ms ease", style({ transform: "translateX(0)" })),
      ]),
      transition(":leave", [
        animate("1000ms ease", style({ transform: "translateX(-100%)" })),
      ]),
    ]),
  ],
})
export class HomeComponent {
  @ViewChild("background") background!: ElementRef;
  isShow = false;

  showMoreInfo() {
    this.isShow = true;
    this.unblurBackground();
  }

  unblurBackground() {
    let filter = this.background.nativeElement.style.filter;
    if (filter != "none") {
      this.background.nativeElement.style.filter = 'none'
    }
  }
}
