import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-timebelt-service',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatIconModule,TranslateModule],
  templateUrl: './timebelt-service.component.html',
  styleUrl: './timebelt-service.component.scss'
})
export class TimebeltServiceComponent {

}
