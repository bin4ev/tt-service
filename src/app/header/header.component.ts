import { Component, inject, signal } from "@angular/core";

import { MatToolbarModule } from "@angular/material/toolbar";
import { AsyncPipe, NgClass, NgOptimizedImage, NgStyle } from '@angular/common'
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { User } from "@angular/fire/auth";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs/internal/Observable";
import { tap } from "rxjs";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import { TranslateModule } from "@ngx-translate/core";
import { LanguagesComponent } from "../shared/languages/languages.component";
import { NavLisstComponent } from "../shared/nav-lisst/nav-lisst.component";
@Component({
  selector: "app-header",
  standalone: true,
  imports: [MatToolbarModule, NgOptimizedImage, RouterLink, RouterLinkActive, MatIconModule, AsyncPipe,NgStyle, MatTooltipModule, MatListModule, NgClass, TranslateModule, LanguagesComponent, NavLisstComponent],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  readonly NAV_LIST = ['home', 'gallery', 'services','contacts'] 
  userData : User | null = null
  isLogedIn$? : Observable<boolean>
  isOpenBar = false
  navList = signal(this.NAV_LIST)


  #authService = inject(AuthService);

  constructor() {
    this.isLogedIn$ = this.#authService.isLogedIn$.pipe(
      tap(_ => this.userData = this.#authService.currentUser)
    )

    console.log(this.userData);
  }

  logOut() {
    this.#authService.logout();
  }
}
