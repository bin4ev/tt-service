import { Routes } from "@angular/router";

import { CreateAppointmentComponent } from "./features/create-appointment/create-appointment.component";
import { SignInComponent } from "./features/auth/sign-in/sign-in.component";
import { SignUpComponent } from "./features/auth/sign-up/sign-up.component";
import { ForgotPasswordComponent } from "./features/auth/forgot-password/forgot-password.component";
import { HomeComponent } from "./features/home/home.component";
import { AboutComponent } from "./features/about/about.component";
import { ServicesComponent } from "./features/service/services.component";

export const routes: Routes = [
  { path: "'/'", redirectTo: "home", pathMatch: "full" },
  { path: "login", component: SignInComponent },
  { path: "register", component: SignUpComponent },
  { path: "forgotPassword", component: ForgotPasswordComponent },
  { path: "home", component: HomeComponent },
  { path: "gallery", component: AboutComponent },
  { path: "services", component: ServicesComponent },
  {
    path: "contacts",
    loadComponent: () =>
      import("./features/contacts/contacts.component").then((m) => m.ContactsComponent),
  },
  {
    path: "services/full-sevice",
    loadComponent: () =>
      import("./features/service/full-service/full-service.component").then(
        (m) => m.FullServiceComponent
      ),
  },
  {
    path: "services/air-condition",
    loadComponent: () =>
      import("./features/service/air-condition/air-condition.component").then(
        (m) => m.AirConditionComponent
      ),
  },
  {
    path: "services/exhaust-system",
    loadComponent: () =>
      import("./features/service/exaust-system/exaust-system.component").then(
        (m) => m.ExaustSystemComponent
      ),
  },
  {
    path: "services/brakes",
    loadComponent: () =>
      import("./features/service/brakes-system/brakes-system.component").then(
        (m) => m.BrakesSystemComponent
      ),
  },
  {
    path: "services/timebelt",
    loadComponent: () =>
      import("./features/service/timebelt-service/timebelt-service.component").then(
        (m) => m.TimebeltServiceComponent
      ),
  },
  {
    path: "services/suspension",
    loadComponent: () =>
      import("./features/service/suspension-system/suspension-system.component").then(
        (m) => m.SuspensionSystemComponent
      ),
  },
  {
    path: "services/transmission",
    loadComponent: () =>
      import("./features/service/transmission-service/transmission-service.component").then(
        (m) => m.TransmissionServiceComponent
      ),
  },
  { path: 'create-appointment', component: CreateAppointmentComponent },
  {path:"**", redirectTo: "home"}
];
