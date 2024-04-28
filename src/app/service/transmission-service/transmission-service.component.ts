import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-transmission-service',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatIconModule,TranslateModule],

  templateUrl: './transmission-service.component.html',
  styleUrl: './transmission-service.component.scss'
})
export class TransmissionServiceComponent {

}
