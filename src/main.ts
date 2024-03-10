import { importProvidersFrom } from "@angular/core";
import { AppComponent } from "./app/app.component";
import {
  withInterceptorsFromDi,
  provideHttpClient,
} from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withViewTransitions } from "@angular/router";
import { routes } from "./app/routing";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getDatabase, provideDatabase } from "@angular/fire/database";
import { getStorage, provideStorage } from "@angular/fire/storage";
import { environment } from "./environments/environment.development";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(
      routes,
      withViewTransitions() // Enable View Transitions
    ),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig))
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
  ],
}).catch((err) => console.error(err));
