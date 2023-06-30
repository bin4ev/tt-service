import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from "./header/header.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from "./home/home.component";
import { FooterComponent } from './footer/footer.component';

@NgModule({
    declarations: [
        AppComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HeaderComponent,
        BrowserAnimationsModule,
        HomeComponent,
        FooterComponent
    ]
})
export class AppModule { }
