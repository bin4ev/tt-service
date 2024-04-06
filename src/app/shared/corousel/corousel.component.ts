import { NgClass } from "@angular/common";
import { Component, Input, input, signal } from "@angular/core";
import { interval } from "rxjs/internal/observable/interval";
import { tap } from "rxjs/internal/operators/tap";
import { untilDestroyed } from "src/app/helpers/utils";

export interface CarouselItem {
  title: string;
  small: string;
  large: string;
  desc: string;
}

@Component({
  selector: "app-corousel",
  standalone: true,
  imports: [NgClass],
  templateUrl: "./corousel.component.html",
  styleUrl: "./corousel.component.scss",
})
export class CorouselComponent {
  @Input({ required: true }) items: CarouselItem[] = [];

  private untilDestroyed = untilDestroyed();
  index = signal(0);

  ngOnInit() {
    interval(10000)
      .pipe(
        this.untilDestroyed(),
        tap((sec) => this.index.update((val) => (val + 1) % this.items.length))
      )
      .subscribe();
  }
}
