import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-book-appointment-btn',
  standalone: true,
  imports: [RouterLink, MatIcon, TranslateModule],
  templateUrl: './book-appointment-btn.component.html',
  styleUrl: './book-appointment-btn.component.scss'
})
export class BookAppointmentBtnComponent {
  show = false
  #router = inject(Router)

  ngOnInit(): void {
    this.#router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkRoute(this.#router.url);
      });
  }

  checkRoute(url: string): void {
    const routesToHideButton = ['/create-appointment'];
    this.show = !routesToHideButton.includes(url);
  }
}
