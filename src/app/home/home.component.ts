import { Component, ElementRef, ViewChild, inject } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { animate, style, transition, trigger } from "@angular/animations";
import { JsmapComponent } from "../jsmap/jsmap.component";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { NgClass } from "@angular/common";
import { CorouselComponent } from "../shared/corousel/corousel.component";
import { ProcessWheelComponent } from "../shared/process-wheel/process-wheel.component";
import { slideIn, slideInOut } from "../animatios";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { untilDestroyed } from "../helpers/utils";
import { ServiceItem } from "../models/services";
import { map, startWith, tap } from "rxjs/operators";

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
    TranslateModule
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  animations: [slideIn, slideInOut],
})
export class HomeComponent {
  @ViewChild("background") background!: ElementRef;
  @ViewChild("carouselElem") carouselElement!: ElementRef;

  services!:ServiceItem[];
  isShowDefaultInfo = false;
  isShowMoreInfo = false;

  private untilDestroyed = untilDestroyed();
  #translateService = inject(TranslateService)

  ngOnInit() {
    this.setServices()
  }

  setServices() {
    this.#translateService.onLangChange.pipe(
      this.untilDestroyed(),
      startWith(this.#translateService.currentLang),
      tap(_ => this.services = this.#translateService.instant("SERVICES")),
    ).subscribe()
  }

  showMoreInfo() {
    this.isShowDefaultInfo = !this.isShowDefaultInfo;
    this.unblurBackground();
    this.isShowMoreInfo = true
    setTimeout(() => {
      
      this.carouselElement.nativeElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
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
