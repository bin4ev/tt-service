import { inject } from "@angular/core";
import {
  patchState,
  signalStore,
  withMethods,
  withState,
} from "@ngrx/signals";
import { Appointment } from "src/app/features/create-appointment/create-appointment.component";
import { AppointmentsService } from "../../services/appointments.service";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";

interface AppointmentsState {
  appointments: Appointment[];
  loading: boolean;
}

const initialState: AppointmentsState = {
  appointments: [],
  loading: false,
};

export const AppointmentsStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withMethods((store, appService = inject(AppointmentsService)) => ({
    async loadAll() {
      patchState(store, { loading: true });

      try {
        const appointments = await firstValueFrom(appService.getAppointments());
        patchState(store, { appointments, loading: false });
      } catch (error) {
        patchState(store, { loading: false });
      }
    },
  })),

);
