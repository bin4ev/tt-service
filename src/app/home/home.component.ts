import { Component, ElementRef, ViewChild } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { animate, style, transition, trigger } from "@angular/animations";
import { JsmapComponent } from "../jsmap/jsmap.component";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { NgClass } from "@angular/common";
import { CorouselComponent } from "../shared/corousel/corousel.component";
import { ProcessWheelComponent } from "../shared/process-wheel/process-wheel.component";
import { slideIn, slideInOut } from "../animatios";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    MatButtonModule,
    JsmapComponent,
    MatCardModule,
    RouterLink,
    NgClass,
    CorouselComponent,
    ProcessWheelComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  animations: [slideIn, slideInOut],
})
export class HomeComponent {
  @ViewChild("background") background!: ElementRef;
  @ViewChild("carouselElem") carouselElement!: ElementRef;

  services = [
    {
      title: "Ремонт и обслужване",
      small: "Предлагаме ",
      large: "Диагностика и цялостно обслужване ",
      desc: "Доверете ни се, и ще се погрижим вашите коли не само да бъдат ремонтирани, но и поддържани в отлично техническо състояние!",
    },
    {
      title: "Специализирано обслужване и поддръжка на климатични системи:",
      small: "Ние се грижим за вашето",
      large: "удобство и комфорт,",
      desc: "От диагностика на проблеми до ремонт и зареждане на охладителния агент, ние сме тук, за да ви осигурим оптимално функциониране на климата във вашия автомобил през цялата година. С нас, вашият комфорт е на първо място.",
    },
    {
      title: "Експресно обслужване на маслото и филтрите:",
      small: "Предлагаме ",
      large:
        "бързо и ефективно обслужване на маслото и филтрите на вашия автомобил.",
      desc: "С нас, може да се доверите за бърза смяна на маслото и филтрите, което ще осигури оптималното функциониране на двигателя и продължителна живот на автомобила ви.",
    },
  ];

  isShowDefaultInfo = false;
  isShowMoreInfo = false;

  showMoreInfo() {
    this.isShowDefaultInfo = !this.isShowDefaultInfo;
    this.unblurBackground();
    this.isShowMoreInfo = true
    setTimeout(() => {
      
      this.carouselElement.nativeElement.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }

  unblurBackground() {
    let filter = this.background.nativeElement.style.filter;
    if (filter != "none") {
      this.background.nativeElement.style.filter = "none";
    }
  }
}
