import { Component, inject } from "@angular/core";

import { MatToolbarModule } from "@angular/material/toolbar";
import { AsyncPipe, NgOptimizedImage, NgStyle } from '@angular/common'
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { User } from "@angular/fire/auth";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs/internal/Observable";
import { tap } from "rxjs";
import {MatTooltipModule} from '@angular/material/tooltip';



@Component({
  selector: "app-header",
  standalone: true,
  imports: [MatToolbarModule, NgOptimizedImage, RouterLink, RouterLinkActive, MatIconModule, AsyncPipe,NgStyle, MatTooltipModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  userData : User | null = null
  isLogedIn$? : Observable<boolean>

  authService = inject(AuthService);

  constructor() {
    this.isLogedIn$ = this.authService.isLogedIn$.pipe(
      tap(_ => this.userData = this.authService.currentUser)
    )

    console.log(this.userData);
  }

  logOut() {
    this.authService.logout();
  }
}
