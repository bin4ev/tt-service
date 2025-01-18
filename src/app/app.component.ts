import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { BookAppointmentBtnComponent } from "./shared/components/book-appointment-btn/book-appointment-btn.component";
import { DateAdapter } from "@angular/material/core";
import { GooglePlaceService } from "./core/services/google-place.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent, BookAppointmentBtnComponent],
})
export class AppComponent {
  #translateService = inject(TranslateService);
  #localAdapter = inject(DateAdapter);
  #googlePlaceService = inject(GooglePlaceService);

  constructor() {
    this.#translateService.setDefaultLang("BG");
    this.#translateService.use("BG");
    this.#localAdapter.setLocale("BG");
    
    this.#translateService.onLangChange.subscribe(lang => this.#localAdapter.setLocale(lang.lang))
    this.#googlePlaceService.getMyPlaceDetails().subscribe();
  }
}
