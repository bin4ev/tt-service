import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-air-condition',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatIconModule, TranslateModule],
  templateUrl: './air-condition.component.html',
  styleUrl: './air-condition.component.scss'
})
export class AirConditionComponent {

}
