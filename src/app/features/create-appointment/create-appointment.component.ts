import { Component, OnInit, inject, signal, viewChild } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import {
  MatCalendar,
} from "@angular/material/datepicker";
import { MatCard } from "@angular/material/card";
import { WORKING_TIME, WORKING_TIME_WEEKEND } from "src/app/core/constants/constants";
import { FormsModule, NgForm } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { NotificationService } from "src/app/core/services/notification.service";
import { NgClass, NgStyle } from "@angular/common";
import { AppointmentsService } from "src/app/core/services/appointments.service";
import { formatDate } from "src/app/core/helpers/utils";


export interface Appointment {
  name: string;
  phone: string;
  email: string;
  date: Date | "";
  slot: string;
  service: "";
  id:string
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
  formValue = signal<Appointment>({ name: "", phone: "", email: "", date: "", slot: "", service: "", id:"" });
  isLoggedIn = false;
  allAppoitments: Appointment[] = [];

  #notificationService = inject(NotificationService);
  #apoitmentService = inject(AppointmentsService);

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0;
  };

  ngOnInit() {
    this.initSlots();
    this.getAllAppoitments();
    this.formValue().date = this.selected();
  }

  getAllAppoitments() {
    this.#apoitmentService.getAppointments().subscribe((res) => {
      this.allAppoitments = res as Appointment[];
      console.log(this.allAppoitments);

      this.setAppoitmentsForDate(this.selected());
    });
  }

  initSlots() {
    let timeRange = this.isSaturday(this.selected().toDateString()) ? this.saturdayTime : this.workingTime;
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

    while (start < end) {
      let slotStart = start.toTimeString().substring(0, 5);
      start.setHours(start.getHours() + range);
      let notAvailable = this.selected().getDate() === this.today.getDate() && start.getHours() <= now;
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
    }
  }

  setAppoitmentsForDate(date: Date) {
    let appoitmentForDate = this.allAppoitments.filter((x) => x.date === formatDate(date));

    if (appoitmentForDate.length > 0) {
      let slots = this.hoursSlots().map((x) => {
        let hour = appoitmentForDate.find((y) => x.range === y.slot);
        return hour ? { range: x.range, available: false } : x;
      });
      this.hoursSlots.set(slots);
      console.log(this.hoursSlots());
    }
  }

  onSubmit(form: NgForm, event: SubmitEvent) {
    if (!this.formValue().slot) {
      this.#notificationService.showError("Трябва да изберете час!"); //da se prewede
      return;
    }

    if (form.invalid) {
      return;
    }

    this.#apoitmentService.createAppointment({ ...this.formValue() }).subscribe((response) => {
      this.#notificationService.showSuccess("Успешно запазихте час!");
      this.getAllAppoitments();
      this.formValue.set({ name: "", phone: "", email: "", date: "", slot: "", service: "", id:"" });
      form.resetForm();
    });
  }

  onSelectedSlot(slot: Slot){

    if (this.formValue().slot === slot.range) {
      this.formValue.set({ ...this.formValue(), slot: "" });
      return;
    }

    this.formValue.set({ ...this.formValue(), slot: slot.range });
  }

}
