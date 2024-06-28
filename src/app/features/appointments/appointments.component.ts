import { Component, ViewChild, inject } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIcon } from "@angular/material/icon";
import { Appointment } from "../create-appointment/create-appointment.component";
import { MatCard } from "@angular/material/card";
import { AppointmentsService } from "src/app/core/services/appointments.service";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { formatDate } from "src/app/core/helpers/utils";
import { AsyncPipe, DatePipe, NgFor } from "@angular/common";
import { ProcessWheelComponent } from "src/app/shared/components/process-wheel/process-wheel.component";
import { Observable, async, finalize, map, of } from "rxjs";
import { NotificationService } from "src/app/core/services/notification.service";

@Component({
  selector: "app-appointments",
  standalone: true,
  imports: [
    TranslateModule,
    MatTableModule,
    MatIcon,
    AsyncPipe,
    MatSortModule,
    MatSort,
    DatePipe,
    ProcessWheelComponent,
    NgFor
  ],
  templateUrl: "./appointments.component.html",
  styleUrl: "./appointments.component.scss",
})
export class AppointmentsComponent {
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ["date", "name", "phone", "email", "slot", "service", "action"];
  dataSource!: MatTableDataSource<Appointment>;
  allAppoitments$: Observable<Appointment[]> = of([]);
  loading = false;

  #apoitmentService = inject(AppointmentsService);
  #notificationService = inject(NotificationService);

  ngOnInit() {
    this.getAllAppoitments();
  }

  ngAfterViewInit() {
   this.setDataSource()
  }

  setDataSource() {
    this.allAppoitments$
    .pipe(
      finalize(() => (this.loading = false)),
      map((dataArr: Appointment[]) => {
        return dataArr.map((x) => {
          return {
            ...x,
            date: formatDate(x["date"]) as Date,
          };
        });
      })
    )
    .subscribe((res: Appointment[]) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
    });
  }

  getAllAppoitments() {
    this.loading = true;
    this.allAppoitments$ = this.#apoitmentService.getAppointments() as Observable<Appointment[]>;
   this.setDataSource()

  }

  deleteAppointment(appointment: Appointment) {
    this.#apoitmentService.deleteAppointment(appointment).subscribe((response) => {
      this.#notificationService.showSuccess("Успешно изтрихте часа!");
      this.getAllAppoitments()
    });
  }
}
