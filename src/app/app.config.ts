import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, PLATFORM_ID } from "@angular/core";
import { provideRouter, withViewTransitions } from "@angular/router";
import { routes } from "./routing";
import { BrowserModule, provideClientHydration, withEventReplay } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { GooglePlaceService } from "./core/services/google-place.service";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";
import { provideNativeDateAdapter } from "@angular/material/core";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { environment } from "src/environments/environment";
import { getStorage, provideStorage } from "@angular/fire/storage";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(
      routes,
      withViewTransitions() // Enable View Transitions
    ),
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
    provideNativeDateAdapter(),
    provideClientHydration( withEventReplay()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
};
