import { AfterViewInit, ChangeDetectorRef, Component, OnInit, inject, signal } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import {
  DateSelectionModelChange,
  MatCalendar,
  MatCalendarCell,
  MatDateSelectionModel,
} from "@angular/material/datepicker";
import { MatCard } from "@angular/material/card";
import { WORKING_TIME, WORKING_TIME_WEEKEND } from "src/app/core/constants/constants";
import { FormsModule, NgForm } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import {MatSelectModule} from '@angular/material/select';
import { NotificationService } from "src/app/core/services/notification.service";
import { NgStyle } from "@angular/common";

export interface Appointment {
  name: string;
  phone: string;
  email: string;
  date: Date | "";
  slot: string;
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
    NgStyle
  ],
  templateUrl: "./create-appointment.component.html",
  styleUrl: "./create-appointment.component.scss",
})
export class CreateAppointmentComponent implements OnInit {
  selected = signal<Date>(new Date());
  workingTime = WORKING_TIME;
  saturdayTime = WORKING_TIME_WEEKEND;
  hoursSlots = signal<string[]>([]);
  formValue = signal<Appointment>({ name: "", phone: "", email: "", date: "", slot: "" });

  #notificationService = inject(NotificationService)

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0;
  };

  ngOnInit() {
    this.initSlots();
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

    while (start < end) {
      let slotStart = start.toTimeString().substring(0, 5);
      start.setHours(start.getHours() + range);
      let slotEnd = start.toTimeString().substring(0, 5);

      this.hoursSlots().push(slotStart + "-" + slotEnd);
    }
  }

  isSaturday(dateString: string) {
    const date = new Date(dateString);
    return date.getDay() === 6;
  }

  onSelectedDate(date: Date | null) {
    console.log(date);
    if (date !== null) {
      this.initSlots(); // get appointForDay
      this.formValue.set({ name: "", phone: "", email: "", date: "", slot: "" })
    }
  }

  onSubmit(form: NgForm, event: SubmitEvent) {
    console.log(form);
    
    if (!this.formValue().slot) {
      this.#notificationService.showError("Трябва да изберете час!") //da se prewede
      return
    }
    if (form.invalid) {
      return;
    }
  }

  onSelectedSlot(slot:string) {
    console.log(slot);
    
    this.formValue.set({...this.formValue(), slot:slot })
    console.log(this.formValue().slot);
    
  }
}
