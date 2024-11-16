import { APP_INITIALIZER, importProvidersFrom } from "@angular/core";
import { AppComponent } from "./app/app.component";
import { withInterceptorsFromDi, provideHttpClient, HttpClient } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { BrowserModule, bootstrapApplication, provideClientHydration } from "@angular/platform-browser";
import { provideRouter, withViewTransitions } from "@angular/router";
import { routes } from "./app/routing";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getStorage, provideStorage } from "@angular/fire/storage";
import { environment } from "./environments/environment.development";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from "@angular/material/core";
import { registerLocaleData } from "@angular/common";
import { firstValueFrom } from "rxjs";
import { GooglePlaceService } from "./app/core/services/google-place.service";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export function initializeAppGetMyPlace(googlePlaceService: GooglePlaceService) {
  return () => firstValueFrom(googlePlaceService.getMyPlaceDetails());
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(
      routes,
      withViewTransitions() // Enable View Transitions
    ),
    importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebaseConfig))),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: "BG",
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppGetMyPlace,
      multi: true,
      deps: [GooglePlaceService],
    },
    provideNativeDateAdapter(), provideClientHydration(),
  ],
}).catch((err) => console.error(err));
