import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-exaust-system',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatIconModule,TranslateModule],
  templateUrl: './exaust-system.component.html',
  styleUrl: './exaust-system.component.scss'
})
export class ExaustSystemComponent {

}
