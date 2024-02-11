import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import {  provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app/routing';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule,),
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(
            routes, 
            withViewTransitions() // Enable View Transitions
          ),
    ]
})
  .catch(err => console.error(err));
