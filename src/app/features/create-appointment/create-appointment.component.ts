import { Component, OnInit, inject, signal, viewChild } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { MatCalendar } from "@angular/material/datepicker";
import { MatCard } from "@angular/material/card";
import {
  WORKING_TIME,
  WORKING_TIME_WEEKEND,
} from "src/app/core/constants/constants";
import { FormsModule, NgForm } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { NotificationService } from "src/app/core/services/notification.service";
import { NgClass, NgStyle } from "@angular/common";
import { AppointmentsService } from "src/app/core/services/appointments.service";
import {
  appendHiddenInputToForm,
  createToggleFunction,
  formatDate,
  isToday,
} from "src/app/core/helpers/utils";
import {
  EMAIL_TEMPLATES_IDS,
  EmailService,
} from "src/app/core/services/email.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "src/app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { map, pipe } from "rxjs";
import { Calendar } from "@fullcalendar/core";
import { CalendarEvent } from "../calendar/services/calendar.service";

export interface Appointment {
  name: string;
  phone: string;
  email: string;
  date: Date | string;
  slot: string;
  service: string;
  id?: string;
  role?: string;
}

export interface Slot {
  available: boolean;
  range: string;
}
@Component({
  selector: "app-create-appointment",
  standalone: true,
  imports: [
    TranslateModule,
    MatCalendar,
    MatCard,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    NgStyle,
    NgClass,
  ],
  templateUrl: "./create-appointment.component.html",
  styleUrl: "./create-appointment.component.scss",
})
export class CreateAppointmentComponent implements OnInit {
  form = viewChild.required<NgForm>("form");

  today = new Date();
  selected = signal<Date>(new Date());
  workingTime = WORKING_TIME;
  saturdayTime = WORKING_TIME_WEEKEND;
  hoursSlots = signal<{ available: boolean; range: string }[]>([]);
  formValue = signal<Appointment>({
    name: "",
    phone: "",
    email: "",
    date: "",
    slot: "",
    service: "",
  });
  isLoggedIn = false;
  allAppoitments: Appointment[] = [];
  toggleFn = createToggleFunction();

  #notificationService = inject(NotificationService);
  #apoitmentService = inject(AppointmentsService);
  #emailService = inject(EmailService);
  #matDialogService = inject(MatDialog);

  myFilter = (d: Date | null): boolean => {
    const day: number = (d || new Date()).getDay();
    if (day === 0) {
      return false;
    }

    if (day === 6) {
      return this.toggleFn();
    }

    return true;
  };

  ngOnInit() {
    this.initSlots();
    this.getAllAppoitments();
    this.formValue().date = this.selected();
  }

  getAllAppoitments() {
    this.#apoitmentService
      .getAppointments()
      .pipe(
        map((res) => {
          return res.map((x: any) => {
            if (x.role === "admin") {
              const calendarEv = {
                ...x,
                start: x.start.seconds * 1000,
                end: x.end.seconds * 1000,
              };
              return this.#apoitmentService.transformEventToBooking(calendarEv);
            }
            return x as Appointment;
          });
        })
      )
      .subscribe((res) => {
        this.allAppoitments = res as Appointment[];
        console.log(this.allAppoitments);
        this.setAppoitmentsForDate(this.selected());
      });
  }

  initSlots() {
    let timeRange = this.isSaturday(this.selected().toDateString())
      ? this.saturdayTime
      : this.workingTime;
    const { startTime, endTime } = this.extractTimes(timeRange);
    const range = 1;
    this.hoursSlots.set([]);
    this.generateHourSlots(startTime, endTime, range);
  }

  extractTimes(workingTime: string) {
    const [startTime, endTime] = workingTime.split("-");
    return { startTime, endTime };
  }

  generateHourSlots(startTime: string, endTime: string, range: number) {
    let start = new Date(`1970-01-01T${startTime}:00`);
    let end = new Date(`1970-01-01T${endTime}:00`);
    let now = new Date().getHours();

    while (start.getHours() < end.getHours()) {
      let slotStart = start.toTimeString().substring(0, 5);
      start.setHours(start.getHours() + range);
      let notAvailable = isToday(this.selected()) && start.getHours() <= now;
      let slotEnd = start.toTimeString().substring(0, 5);
      let slot = {
        available: !notAvailable,
        range: slotStart + "-" + slotEnd,
      };

      this.hoursSlots().push(slot);
    }
  }

  isSaturday(dateString: string) {
    const date = new Date(dateString);
    return date.getDay() === 6;
  }

  onSelectedDate(date: Date | null) {
    if (date !== null) {
      this.initSlots();
      this.setAppoitmentsForDate(date);
      this.formValue.set({ ...this.formValue(), date, slot: "" });
      return;
    }

    this.formValue.set({ ...this.formValue(), date: this.selected() });
  }

  setAppoitmentsForDate(date: Date) {
    let appoitmentForDate = this.allAppoitments.filter(
      (x) => x.date === formatDate(date)
    );

    if (appoitmentForDate.length > 0) {
      let slots = this.hoursSlots().map((slot) => {
        // Convert slot range to start and end Date objects
        const [slotStartStr, slotEndStr] = slot.range.split("-");
        const slotStart = new Date(`1970-01-01T${slotStartStr}:00`);
        const slotEnd = new Date(`1970-01-01T${slotEndStr}:00`);

        // Check if this slot overlaps with any booked slot
        const isOverlapping = appoitmentForDate.some((appt) => {
          const [apptStartStr, apptEndStr] = appt.slot.split("-");
          const apptStart = new Date(`1970-01-01T${apptStartStr}:00`);
          const apptEnd = new Date(`1970-01-01T${apptEndStr}:00`);

          return slotStart < apptEnd && slotEnd > apptStart; // Overlapping logic
        });

        return {
          range: slot.range,
          available: !isOverlapping,
        };
      });

      this.hoursSlots.set([...slots]);
      return;
    }

    this.initSlots();
  }

  onSubmit(form: NgForm, event: SubmitEvent) {
    const { slot, date } = this.formValue();

    if (!slot) {
      this.#notificationService.showError("Трябва да изберете час!"); //da se prewede
      return;
    }

    if (!date) {
      this.#notificationService.showError("Трябва да изберете дата!"); //da se prewede
      return;
    }

    if (form.invalid) {
      return;
    }

    const dialogRef = this.#matDialogService.open(ConfirmationDialogComponent);
    let config = dialogRef.componentInstance.config();
    config = {
      ...config,
      title: "Потвърждение",
      message: `Сигурни ли сте, че искате да запазите час ${
        slot.split("-")[0]
      } за дата ${formatDate(date)} ?`,
    };

    dialogRef.componentInstance.config = signal(config);
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.#apoitmentService
          .createAppointment({ ...this.formValue() })
          .subscribe((response) => {
            this.#notificationService.showSuccess("Успешно запазихте час!");
            this.sendEmailToClien(event);
            this.sendEmailToAdmin(event);
            this.getAllAppoitments();
            this.formValue.set({
              name: "",
              phone: "",
              email: "",
              date: "",
              slot: "",
              service: "",
            });
            form.resetForm();
          });
      }
    });
  }

  onSelectedSlot(slot: Slot) {
    if (this.formValue().slot === slot.range) {
      this.formValue.set({ ...this.formValue(), slot: "" });
      return;
    }

    this.formValue.set({ ...this.formValue(), slot: slot.range });
  }

  sendEmailToClien(event: SubmitEvent) {
    let form = event.target as HTMLFormElement;

    appendHiddenInputToForm(
      form,
      "date",
      formatDate(this.formValue().date) as string
    );
    appendHiddenInputToForm(form, "slot", this.formValue().slot.split("-")[0]);

    this.#emailService
      .sendEmail(form, EMAIL_TEMPLATES_IDS.CREATE_APPOINTMENT)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
          this.#notificationService.showError(
            `${err.text}. Email sending failed`
          );
        },
      });
  }

  sendEmailToAdmin(event: SubmitEvent) {
    let form = event.target as HTMLFormElement;
    appendHiddenInputToForm(form, "service", this.formValue().service);
    this.#emailService
      .sendEmail(event.target as HTMLFormElement, EMAIL_TEMPLATES_IDS.CONTACT)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
