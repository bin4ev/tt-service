import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Signal,
  ViewChild,
  WritableSignal,
  computed,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIcon } from "@angular/material/icon";
import { Appointment } from "../create-appointment/create-appointment.component";
import { AppointmentsService } from "src/app/core/services/appointments.service";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { formatDate } from "src/app/core/helpers/utils";
import { NgClass } from "@angular/common";
import { ProcessWheelComponent } from "src/app/shared/components/process-wheel/process-wheel.component";
import { NotificationService } from "src/app/core/services/notification.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "src/app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { AppointmentsStore } from "src/app/core/state/appointments/appointmenents.store";

@Component({
  selector: "app-appointments",
  standalone: true,
  imports: [
    TranslateModule,
    MatTableModule,
    MatIcon,
    MatSortModule,
    MatSort,
    ProcessWheelComponent,
    NgClass,
  ],
  templateUrl: "./appointments.component.html",
  styleUrl: "./appointments.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsComponent implements AfterViewInit {
  sort = viewChild(MatSort);

  readonly AppointmentsStore = inject(AppointmentsStore);

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

  dataSource = computed(() => {
    const matTableDataSource = new MatTableDataSource<Appointment>(
      this.AppointmentsStore.appointments()
    );
    matTableDataSource.sort = this.sort()!;
    matTableDataSource.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case "date":
          return formatDate(item.date);
        default:
          return item[property];
      }
    };
    matTableDataSource?.sort?.sort({ id: "date", start: "desc", disableClear: false });
    return matTableDataSource;
 });

  selectedRow: WritableSignal<Appointment | null> = signal(null);

  #apoitmentService = inject(AppointmentsService);
  #notificationService = inject(NotificationService);
  #matDialogService = inject(MatDialog);

  ngAfterViewInit() {
    this.AppointmentsStore.loadAll();
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
              this.AppointmentsStore.loadAll();
            });
        }
      });
  }
}
