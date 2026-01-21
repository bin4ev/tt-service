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

export function formatDate(date: Date | string): Date | string | null {
  if (typeof date === "string") {
    const regex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!regex.test(date)) {
      return null;
    }

    let [day, month, year] = date.split(".").map(Number);

    if (isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || day > 31 || month < 1 || month > 12 || year < 1) {
      return null;
    }

    let parsedDate = new Date(year, month - 1, day);
    if (parsedDate.getDate() !== day || parsedDate.getMonth() !== month - 1 || parsedDate.getFullYear() !== year) {
      return null;
    }

    return parsedDate;
  }

  let day = date.getDate().toString().padStart(2, "0");
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let year = date.getFullYear();
  
  return `${day}.${month}.${year}`;
}

export function appendHiddenInputToForm(form:HTMLFormElement, key:string, value:string) {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = key;
  input.value = value;
  form.appendChild(input);
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
}

export function createToggleFunction() {
  let state = true;
  
  return function() {
      state = !state;
      return state;
  }
}

/**
 * Parses BG date string in format DD.MM.YYYY to Date object
 * @param dateStr - date string like "25.12.2005"
 * @returns Date object or null if invalid
 */
export function parseBgDate(dateStr: string): Date | null {
  
  if (!dateStr) {
    return null;
  }

  const parts = dateStr.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const [dayStr, monthStr, yearStr] = parts;

  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year)
  ) {
    return null;
  }

  // Month is 0-based in JS Date
  const date = new Date(year, month - 1, day);

  // Validate that date components didn't overflow
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}





