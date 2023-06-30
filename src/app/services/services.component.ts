import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "app-services",
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: "./services.component.html",
  styleUrls: ["./services.component.scss"],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-500%)' }),
        animate('1000ms ease', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('1000ms ease', style({ transform: 'translateX(-500%)' }))
      ])
    ])
  ]
})
export class ServicesComponent {
  services: any[] = [
    {
      title: "СЕРВИЗНО ОБСЛУЖВАНЕ",
    },
    {
      title: "СПИРАЧНА СИСТЕМА",
    },
    {
      title: "КЛИМАТИК",
    },
    {
      title: " ИЗПУСКАТЕЛНА СИСТЕМА",
    },
    {
      title: "АНГРЕНАЖЕН РЕМЪК",
    },
    {
      title: " ОКАЧВАНЕ",
    },
    {
      title: "МЕХАНИЧНИ РЕМОНТИ",
    },
    {
      title: " ПРОВЕРКА НА МАСЛОТО",
    },
    
  ];
}
