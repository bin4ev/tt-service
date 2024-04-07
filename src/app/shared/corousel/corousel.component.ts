import { NgClass, NgStyle } from "@angular/common";
import { Component, Input, input, signal } from "@angular/core";
import { Subject, Subscription, takeUntil } from "rxjs";
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
  imports: [NgClass, NgStyle],
  templateUrl: "./corousel.component.html",
  styleUrl: "./corousel.component.scss",
})
export class CorouselComponent {
  @Input({ required: true }) items: CarouselItem[] = [];

  private untilDestroyed = untilDestroyed();
  private destroy$ = new Subject<void>();
  index = signal(0);
 
  ngOnInit() {
   this.startInterval() 
  }

  startInterval() {
    interval(10000)
    .pipe(
      takeUntil(this.destroy$),
      tap((sec) => this.index.update((val) => (val + 1) % this.items.length))
    )
    .subscribe()
  }

  goTo(index:number){
    this.index.set(index);
    this.resetInterval()
  }

  resetInterval() {
    this.destroy$.next(); 
    this.startInterval(); 
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
