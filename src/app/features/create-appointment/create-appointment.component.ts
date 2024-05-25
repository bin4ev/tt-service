import { AfterViewInit, ChangeDetectorRef, Component, inject, signal } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { DateSelectionModelChange, MatCalendar, MatCalendarCell, MatDateSelectionModel } from "@angular/material/datepicker";
import { MatCard } from "@angular/material/card";
import { WORKING_TIME, WORKING_TIME_WEEKEND } from "src/app/core/constants/constants";
@Component({
  selector: "app-create-appointment",
  standalone: true,
  imports: [TranslateModule, MatCalendar, MatCard],
  templateUrl: "./create-appointment.component.html",
  styleUrl: "./create-appointment.component.scss",
})
export class CreateAppointmentComponent implements AfterViewInit {
  selected = signal<Date>(new Date())
  workingTime = WORKING_TIME;
  saturdayTime = WORKING_TIME_WEEKEND
  hoursSlots =signal<string[]>([])

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0;
  };

  ngAfterViewInit() {
   
  }

  initSlots() {
    let timeRange = this.isSaturday(this.selected().toDateString()) ? this.saturdayTime:this.workingTime
    const { startTime, endTime } = this.extractTimes(timeRange);
    const range = 1;
    this.hoursSlots.set([])
    this.generateHourSlots(startTime, endTime, range);
  }

  extractTimes(workingTime: string) {
    const [startTime, endTime] = workingTime.split("-");
    return { startTime, endTime };
  }

  generateHourSlots(startTime:string, endTime:string, range:number) {
    let start = new Date(`1970-01-01T${startTime}:00`);
    let end = new Date(`1970-01-01T${endTime}:00`);

    while (start < end) {
      let slotStart = start.toTimeString().substring(0, 5);
      start.setHours(start.getHours() + range);
      let slotEnd = start.toTimeString().substring(0, 5);


      this.hoursSlots().push(slotStart + " - " + slotEnd)
    }

    
  }

  isSaturday(dateString: string) {
    const date = new Date(dateString);
    return date.getDay() === 6;
  }

  onSelected(date:Date|null) {
    console.log(date);
    if (date !== null) {
      this.initSlots()
    }
  }
}
