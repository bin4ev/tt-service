import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { ServicesComponent } from "./service/services.component";

export const routes: Routes = [
  { path: "'/'", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "services", component: ServicesComponent },
  {
    path: "contacts",
    loadComponent: () =>
      import("./contacts/contacts.component").then((m) => m.ContactsComponent),
  },
  {
    path: "services/full-sevice",
    loadComponent: () =>
      import("./service/full-service/full-service.component").then(
        (m) => m.FullServiceComponent
      ),
  },
  {
    path: "services/air-condition",
    loadComponent: () =>
      import("./service/air-condition/air-condition.component").then(
        (m) => m.AirConditionComponent
      ),
  },
  {
    path: "services/exhaust-system",
    loadComponent: () =>
      import("./service/exaust-system/exaust-system.component").then(
        (m) => m.ExaustSystemComponent
      ),
  },
];
