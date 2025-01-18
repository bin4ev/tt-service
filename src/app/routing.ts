import { Routes } from "@angular/router";











export const routes: Routes = [
  { path: "'/'", redirectTo: "home", pathMatch: "full" },
  { path: "login", loadComponent: () => import('./features/auth/sign-in/sign-in.component').then(m => m.SignInComponent) },
  { path: "register", loadComponent: () => import('./features/auth/sign-up/sign-up.component').then(m => m.SignUpComponent) },
  { path: "forgotPassword", loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: "home", loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: "gallery", loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent) },
  { path: "services", loadComponent: () => import('./features/service/services.component').then(m => m.ServicesComponent) },
  { path: "appointments", loadComponent: () => import('./features/appointments/appointments.component').then(m => m.AppointmentsComponent) },
  { path: "feedbacks", loadComponent: () => import('./features/feedbacks/feedbacks.component').then(m => m.FeedbacksComponent) },
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
  { path: 'create-appointment', loadComponent: () => import('./features/create-appointment/create-appointment.component').then(m => m.CreateAppointmentComponent) },
  {path:"**", redirectTo: "home"}
];
