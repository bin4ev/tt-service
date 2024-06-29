import { Component, ViewChild, inject } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIcon } from "@angular/material/icon";
import { Appointment } from "../create-appointment/create-appointment.component";
import { MatCard } from "@angular/material/card";
import { AppointmentsService } from "src/app/core/services/appointments.service";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { formatDate, untilDestroyed } from "src/app/core/helpers/utils";
import { AsyncPipe, DatePipe, NgFor } from "@angular/common";
import { ProcessWheelComponent } from "src/app/shared/components/process-wheel/process-wheel.component";
import { BehaviorSubject, Observable, Subject, async, finalize, map, of, take } from "rxjs";
import { NotificationService } from "src/app/core/services/notification.service";
import { ResolveStart } from "@angular/router";

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
    NgFor,
  ],
  templateUrl: "./appointments.component.html",
  styleUrl: "./appointments.component.scss",
})
export class AppointmentsComponent {
  @ViewChild(MatSort) sort!: MatSort;

  untilDestroyed = untilDestroyed();
  displayedColumns: string[] = ["date", "name", "phone", "email", "slot", "service", "action"];
  responsiveCol: string[] = ["date", "slot", "service", "action"];
  dataSource!: MatTableDataSource<Appointment>;
  allAppoitmentsAvailable: Subject<boolean> = new Subject();
  allallAppoitmentsAvailable$ = this.allAppoitmentsAvailable.asObservable();
  loading = false;

  #apoitmentService = inject(AppointmentsService);
  #notificationService = inject(NotificationService);

  ngOnInit() {
    this.getAllAppoitments();
  }

  ngAfterViewInit() {
    this.allallAppoitmentsAvailable$.pipe(this.untilDestroyed()).subscribe((bool) => {
      if (bool) {
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (item: any, property) => {
          switch (property) {
            case "date":
              return formatDate(item.date);
            default:
              return item[property];
          }
        };
      }
    });
  }

  getAllAppoitments() {
    this.loading = true;
    this.#apoitmentService
      .getAppointments()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: Appointment[]) => {
        this.dataSource = new MatTableDataSource(res);
        console.log(res);

        this.allAppoitmentsAvailable.next(true);
      });
  }

  deleteAppointment(appointment: Appointment) {
    this.#apoitmentService.deleteAppointment(appointment).subscribe((response) => {
      this.#notificationService.showSuccess("Успешно изтрихте часа!");
      this.getAllAppoitments();
    });
  }
}
