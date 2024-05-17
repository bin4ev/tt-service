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
  cordX = 0;

  ngOnInit() {
    this.startInterval();
  }

  startInterval() {
    interval(10000)
      .pipe(
        takeUntil(this.destroy$),
        tap((sec) => this.index.update((val) => (val + 1) % this.items.length))
      )
      .subscribe();
  }

  goTo(index: number) {
    this.index.set(index);
    this.resetInterval();
  }

  resetInterval() {
    this.destroy$.next();
    this.startInterval();
  }

  onMouseDown(e: MouseEvent) {
    this.cordX = e.clientX;
  }

  onMouseUp(e: MouseEvent, index: number) {
    let cordX = e.clientX;
    let diff = cordX - this.cordX;
    this.cordX = 0;

    if (Math.abs(diff) > 50) {
      const offset = diff > 0 ? -1 : 1;
      const idx = Math.min(Math.max(0, index + offset), this.items.length - 1);
      this.goTo(idx);
    }
  }

  onTouchStart(e: TouchEvent) {
    this.cordX = e.touches[0].clientX;
  }

  onTouchEnd(e: TouchEvent, index: number) {
    let cordX = e.changedTouches[0].clientX;
    let diff = cordX - this.cordX;
    this.cordX = 0;

    if (Math.abs(diff) > 50) {
      const offset = diff > 0 ? -1 : 1;
      const idx = Math.min(Math.max(0, index + offset), this.items.length - 1);
      this.goTo(idx);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
