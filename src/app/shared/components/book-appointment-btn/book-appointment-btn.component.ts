import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-book-appointment-btn',
  standalone: true,
  imports: [RouterLink, MatIcon, TranslateModule],
  templateUrl: './book-appointment-btn.component.html',
  styleUrl: './book-appointment-btn.component.scss'
})
export class BookAppointmentBtnComponent {
}
