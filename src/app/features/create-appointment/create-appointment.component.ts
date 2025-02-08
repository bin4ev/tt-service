import { Component, OnInit, inject, signal, viewChild } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { MatCalendar } from "@angular/material/datepicker";
import { MatCard } from "@angular/material/card";
import {
  DEFAULT_NAME,
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
import { AuthService } from "src/app/core/services/auth.service";
import { ProcessWheelComponent } from "src/app/shared/components/process-wheel/process-wheel.component";
import { finalize } from "rxjs";

export interface Appointment {
  name: string;
  phone: string;
  email: string;
  date: Date | "";
  slot: string;
  service: string;
  id: string;
  locked: boolean;
}

export interface Slot {
  available: boolean;
  range: string;
  locked: boolean;
  id?:string
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
    ProcessWheelComponent,
  ],
  templateUrl: "./create-appointment.component.html",
  styleUrl: "./create-appointment.component.scss",
})
export class CreateAppointmentComponent implements OnInit {
  #notificationService = inject(NotificationService);
  #apoitmentService = inject(AppointmentsService);
  #emailService = inject(EmailService);
  #matDialogService = inject(MatDialog);
  #authService = inject(AuthService);

  form = viewChild.required<NgForm>("form");

  today = new Date();
  selected = signal<Date>(new Date());
  workingTime = WORKING_TIME;
  saturdayTime = WORKING_TIME_WEEKEND;
  hoursSlots = signal<Slot[]>([]);
  formValue = signal<Appointment>({
    name: "",
    phone: "",
    email: "",
    date: "",
    slot: "",
    service: "",
    id: "",
    locked: false,
  });
  allAppoitments: Appointment[] = [];
  toggleFn = createToggleFunction();
  isLoggedIn = this.#authService.isLoggedIn;
  loading = false;

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
    this.getAllAppoitments();
    this.formValue().date = this.selected();
  }

  getAllAppoitments() {
    this.#apoitmentService.getAppointments().subscribe((res) => {
      this.allAppoitments = res as Appointment[];
      console.log(this.allAppoitments);
      this.initSlots();
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
        locked: false,
      };

      this.hoursSlots.update((x) => [...x, slot]);
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
      let slots = this.hoursSlots().map((x) => {
        let hour = appoitmentForDate.find((y) => x.range === y.slot);
        return hour
          ? { range: x.range, available: false, locked: hour.locked, id:hour.id }
          : x;
      });

      this.hoursSlots.set([...slots]);
    }
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
              id: "",
              locked: false,
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

    this.formValue.set({ ...this.formValue(), slot: slot.range, locked: slot.locked, id: slot.id  || "" });
    debugger
    console.log(this.formValue())
    

    if (this.isLoggedIn) {
      if (slot.locked) {
        this.unlockSlot();
      } else {
        this.lockSlot();
      }
    }
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

  lockSlot() {
    const { slot, date } = this.formValue();

    if (!slot) {
      this.#notificationService.showError("Трябва да изберете час!"); //da se prewede
      return;
    }

    if (!date) {
      this.#notificationService.showError("Трябва да изберете дата!"); //da se prewede
      return;
    }

    this.formValue.update((x) => ({ ...x, locked: true, name: DEFAULT_NAME, service: "Заключен час" }));

    if (this.isLoggedIn) {
      this.loading = true;
      this.#apoitmentService
        .createAppointment({ ...this.formValue() })
        .pipe(finalize(() => (this.loading = false)))
        .subscribe((res) => {
          this.getAllAppoitments();
          this.#notificationService.showSuccess("Успешно заключихте час!");
          this.formValue.set({
            name: "",
            phone: "",
            email: "",
            date: this.selected(),
            slot: "",
            service: "",
            id: "",
            locked: false,
          });
        });
    }
  }

  unlockSlot() {

    this.#apoitmentService
      .deleteAppointment({ ...this.formValue() })
      .subscribe((response) => {
        this.#notificationService.showSuccess("Успешно отключихте часа!");
        this.getAllAppoitments();
        this.formValue.set({
          name: "",
          phone: "",
          email: "",
          date: this.selected(),
          slot: "",
          service: "",
          id: "",
          locked: false,
        });
      });
  }
}
