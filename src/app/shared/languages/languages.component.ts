import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import {MatMenuModule} from '@angular/material/menu';
import { MatIcon } from "@angular/material/icon";
import { NgOptimizedImage } from "@angular/common";


export const LANGULAGE = 'language'
@Component({
  selector: "languages",
  templateUrl: "./languages.component.html",
  styleUrls: ["./languages.component.scss"],
  standalone:true,
  imports: [TranslateModule, MatMenuModule,MatIcon, NgOptimizedImage]
})
export class LanguagesComponent implements OnInit, OnDestroy {
  langToShow: string[] = [];
  readonly languageList: string[] = ["EN", "BG",];
  language: string = "";
  sub: Subscription = new Subscription();
  session: any;

  #translateService = inject(TranslateService)

  ngOnInit(): void {
    this.language = this.#translateService .currentLang;
    this.changeLanguage(this.language)
    this.langToShow = this.languageList.filter((x) => x != this.language);

    this.#translateService.onLangChange.subscribe((event: any) => {
      console.log('Language changed:', event.lang);
    })
  }

  changeLanguage(currLanguage: string) {
    this.language = currLanguage;
    this.#translateService.use(this.language);
    this.langToShow = this.languageList.filter((x) => x != this.language);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
