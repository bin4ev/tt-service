import { Component, inject } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [HeaderComponent, RouterOutlet, FooterComponent,]
})
export class AppComponent {
  #translateService = inject(TranslateService)

  constructor() {
  this.#translateService.setDefaultLang('BG')
  this.#translateService.use('BG')
  }
}
