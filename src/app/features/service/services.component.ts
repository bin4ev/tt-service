import { Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { animate, style, transition, trigger } from "@angular/animations";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-services",
  standalone: true,
  imports: [CommonModule, MatCardModule ,NgOptimizedImage,RouterLink,TranslateModule ],
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
      title: "SERVICE_PAGE.service_pills_title.service",
      iconPath: "assets/images/repair-services/engine.svg",
      path: "full-sevice",
    },
    {
      title: "SERVICE_PAGE.service_pills_title.brake_system",
      iconPath: "assets/images/repair-services/brakes.svg",
      path: "brakes",
    },
    {
      title: "SERVICE_PAGE.service_pills_title.air_conditioning",
      iconPath: "assets/images/repair-services/airCondition.svg",
      path: "air-condition",
    },
    {
      title: "SERVICE_PAGE.service_pills_title.exhaust_system",
      iconPath: "assets/images/repair-services/exhaustSistem.svg",
      path: "exhaust-system",
    },
    {
      title: "SERVICE_PAGE.service_pills_title.timing_belt",
      iconPath: "assets/images/repair-services/tuneUp.svg",
      path: "timebelt",
    },
    {
      title: "SERVICE_PAGE.service_pills_title.suspension",
      iconPath: "assets/images/repair-services/suspension.svg",
      path: "suspension",
    },
    {
      title: "SERVICE_PAGE.service_pills_title.transmission",
      iconPath: "assets/images/repair-services/transmision.svg",
      path: "transmission",
    },
    
  ];
}
