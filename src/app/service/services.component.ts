import { Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "app-services",
  standalone: true,
  imports: [CommonModule, MatCardModule ,NgOptimizedImage ],
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
    },
    {
      title: "СПИРАЧНА СИСТЕМА",
      iconPath: "assets/images/repair-services/brakes.svg",
    },
    {
      title: "КЛИМАТИК",
      iconPath: "assets/images/repair-services/airCondition.svg",

    },
    {
      title: " ИЗПУСКАТЕЛНА СИСТЕМА",
      iconPath: "assets/images/repair-services/exhaustSistem.svg",
    },
    {
      title: "АНГРЕНАЖЕН РЕМЪК",
      iconPath: "assets/images/repair-services/tuneUp.svg",
    },
    {
      title: " ОКАЧВАНЕ",
      iconPath: "assets/images/repair-services/suspension.svg",
    },
    {
      title: "Скоростна кутия",
      iconPath: "assets/images/repair-services/transmision.svg",
    },
    
  ];
}
