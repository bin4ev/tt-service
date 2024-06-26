import { DestroyRef, inject } from "@angular/core";
import { Subject, takeUntil } from "rxjs";

export function untilDestroyed() {
  const subject = new Subject();

  inject(DestroyRef).onDestroy(() => {
    subject.next(true);
    subject.complete();
  });

  return <T>() => takeUntil<T>(subject.asObservable());
}

// Function to format date to "dd.mm.yyyy"
export function formatDate(date:Date) {
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    let year = date.getFullYear();
    return `${day}.${month}.${year}`;
}