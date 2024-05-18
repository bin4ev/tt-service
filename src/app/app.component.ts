import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BookAppointmentBtnComponent } from './shared/components/book-appointment-btn/book-appointment-btn.component';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [HeaderComponent, RouterOutlet, FooterComponent,BookAppointmentBtnComponent]
})
export class AppComponent {
  #translateService = inject(TranslateService)

  constructor() {
  this.#translateService.setDefaultLang('BG')
  this.#translateService.use('BG')
  }
}
