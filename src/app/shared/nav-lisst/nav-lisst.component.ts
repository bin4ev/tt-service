import { Component, Input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-lisst',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './nav-lisst.component.html',
  styleUrl: './nav-lisst.component.scss'
})
export class NavLisstComponent {
 @Input({required:true}) navList = signal<string[]>([])
}
