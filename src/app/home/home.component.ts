import {
  Component,
  ElementRef,
  Signal,
  ViewChild,
  signal,
} from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { animate, style, transition, trigger } from "@angular/animations";
import { JsmapComponent } from "../jsmap/jsmap.component";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { interval, startWith, tap } from "rxjs";
import { untilDestroyed } from "../helpers/utils";
import { NgClass } from "@angular/common";
import { CorouselComponent } from "../shared/corousel/corousel.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [MatButtonModule, JsmapComponent, MatCardModule, RouterLink, NgClass, CorouselComponent],
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

  services = [
    {
      title: "Ремонт и обслужване",
      small: "Предлагаме ",
      large: "Диагностика",
      desc: " Доверете ни се, и ще се погрижим вашите коли не само да бъдат ремонтирани, но и поддържани в отлично техническо състояние!",
    },
    {
      title: "Ремонт и обслужване2",
      small: "Предлагаме ",
      large: "Диагностика",
      desc: " Доверете ни се, и ще се погрижим вашите коли не само да бъдат ремонтирани, но и поддържани в отлично техническо състояние!",
    },
    {
      title: "Ремонт и обслужване3",
      small: "Предлагаме ",
      large: "Диагностика",
      desc: " Доверете ни се, и ще се погрижим вашите коли не само да бъдат ремонтирани, но и поддържани в отлично техническо състояние!",
    },
  ];

  isShow = false;

  showMoreInfo() {
    this.isShow = !this.isShow;
    this.unblurBackground()
  }

  unblurBackground() {
    let filter = this.background.nativeElement.style.filter;
    if (filter != "none") {
      this.background.nativeElement.style.filter = "none";
    }
  }
}
