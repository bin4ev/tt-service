import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { animate, style, transition, trigger } from "@angular/animations"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
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
export class HomeComponent {
  isShow = false;

  showMoreInfo() {
    this.isShow = true;
  }
}
