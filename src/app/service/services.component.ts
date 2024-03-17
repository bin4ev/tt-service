import { Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { animate, style, transition, trigger } from "@angular/animations";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-services",
  standalone: true,
  imports: [CommonModule, MatCardModule ,NgOptimizedImage,RouterLink ],
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
      iconPath: "assets/images/repair-services/engine.svg",
      path: "full-sevice",
    },
    {
      title: "СПИРАЧНА СИСТЕМА",
      iconPath: "assets/images/repair-services/brakes.svg",
      path: "brakes",
    },
    {
      title: "КЛИМАТИК",
      iconPath: "assets/images/repair-services/airCondition.svg",
      path: "air-condition",
    },
    {
      title: " ИЗПУСКАТЕЛНА СИСТЕМА",
      iconPath: "assets/images/repair-services/exhaustSistem.svg",
      path: "exhaust-system",
    },
    {
      title: "АНГРЕНАЖЕН РЕМЪК",
      iconPath: "assets/images/repair-services/tuneUp.svg",
      path: "timebelt",
    },
    {
      title: " ОКАЧВАНЕ",
      iconPath: "assets/images/repair-services/suspension.svg",
      path: "suspension",
    },
    {
      title: "Скоростна кутия",
      iconPath: "assets/images/repair-services/transmision.svg",
      path: "transmission",
    },
    
  ];
}
