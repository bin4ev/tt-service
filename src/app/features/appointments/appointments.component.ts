import {
  Component,
  ViewChild,
  WritableSignal,
  inject,
  signal,
} from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import {
  MatTableDataSource,
  MatTableModule,
  MatNoDataRow,
} from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { Appointment } from "../create-appointment/create-appointment.component";

import { AppointmentsService } from "src/app/core/services/appointments.service";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { parseBgDate, untilDestroyed } from "src/app/core/helpers/utils";
import { NgClass } from "@angular/common";
import { ProcessWheelComponent } from "src/app/shared/components/process-wheel/process-wheel.component";
import { Subject, finalize, map } from "rxjs";
import { NotificationService } from "src/app/core/services/notification.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "src/app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { CdkColumnDef } from "@angular/cdk/table";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";

@Component({
  selector: "app-appointments",
  standalone: true,
  imports: [
    TranslateModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    ProcessWheelComponent,
    NgClass,
    MatNoDataRow,
    MatFormFieldModule,
    MatInput,
  ],
  templateUrl: "./appointments.component.html",
  styleUrl: "./appointments.component.scss",
})
export class AppointmentsComponent {
  @ViewChild(MatSort) sort!: MatSort;

  untilDestroyed = untilDestroyed();
  displayedColumns: string[] = [
    "date",
    "name",
    "phone",
    "email",
    "slot",
    "service",
    "action",
  ];
  responsiveCol: string[] = ["date", "slot", "service", "action"];
  dataSource: MatTableDataSource<Appointment> = new MatTableDataSource();
  allAppoitmentsAvailable: Subject<boolean> = new Subject();
  allallAppoitmentsAvailable$ = this.allAppoitmentsAvailable.asObservable();
  loading = false;
  selectedRow: WritableSignal<Appointment | null> = signal(null);

  #apoitmentService = inject(AppointmentsService);
  #notificationService = inject(NotificationService);
  #matDialogService = inject(MatDialog);

  ngOnInit() {
    this.getAllAppoitments();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case "date":
          return parseBgDate(item.date);
        default:
          return item[property];
      }
    };
  }

  getAllAppoitments() {
    this.loading = true;
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
        }),
        finalize(() => (this.loading = false)),
      )
      .subscribe((res: Appointment[]) => {
        console.log(res);
        this.dataSource.data = res.sort(
          (a, b) =>
            parseBgDate(b.date as string)!.getTime() -
            parseBgDate(a.date as string)!.getTime(),
        );
      });
  }

  deleteAppointment(appointment: Appointment) {
    this.selectedRow.set(appointment);
    this.#matDialogService
      .open(ConfirmationDialogComponent)
      .afterClosed()
      .subscribe((res) => {
        this.selectedRow.set(null);
        if (res) {
          this.#apoitmentService
            .deleteAppointment(appointment)
            .subscribe((response) => {
              this.#notificationService.showSuccess("Успешно изтрихте часа!");
              this.getAllAppoitments();
            });
        }
      });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filter = value;
  }
}
