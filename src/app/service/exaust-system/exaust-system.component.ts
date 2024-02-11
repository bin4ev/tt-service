import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-exaust-system',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatIconModule],
  templateUrl: './exaust-system.component.html',
  styleUrl: './exaust-system.component.scss'
})
export class ExaustSystemComponent {

}
