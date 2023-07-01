import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatButtonModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('1000ms ease', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('1000ms ease', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class ContactsComponent {

}
