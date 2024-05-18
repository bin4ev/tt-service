import { animate, style, transition, trigger } from "@angular/animations";

export const slideInOut = trigger("slideInOut", [
  transition(":enter", [
    style({ transform: "translateX(-100%)" }),
    animate("1000ms ease", style({ transform: "translateX(0)" })),
  ]),
  transition(":leave", [
    animate("1000ms ease", style({ transform: "translateX(-100%)" })),
  ]),
]);

export const slideIn = trigger("slideIn", [
  transition(":enter", [
    style({ transform: "translateX(-100%)" }),
    animate("1000ms ease", style({ transform: "translateX(0)" })),
  ]),
]);
