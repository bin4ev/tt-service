import { inject, Injectable } from "@angular/core";
import { Appointment } from "../../create-appointment/create-appointment.component";
import { AppointmentsService } from "src/app/core/services/appointments.service";
import { map } from "rxjs/operators";
import { NotificationService } from "src/app/core/services/notification.service";

export interface CalendarEvent {
  id?: string;
  title: string;
  start: string | Date;
  end: string | Date;
  extendedProps: {
    email: string;
    phone: string;
    service: string;
    car?: string;
    modelYear?: string;
    modification?: string;
  };
  role?: string;
}

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  #appointmentService = inject(AppointmentsService);
  #notificationService = inject(NotificationService);



  getEvents() {
    return this.#appointmentService.getAppointments().pipe(
      map((res) =>
        res.map((app) => {
          if (app?.role !== "admin") {
            return this.#appointmentService.transformBookingToEvent(app);
          }
          const adminEv = structuredClone(app) as any;
          console.log(adminEv);
          
          return {
            ...app,
            start: new Date(adminEv.start.seconds * 1000),
            end: new Date(adminEv.end.seconds * 1000),
          };
        })
      )
    );
  }

  createEvent(event: CalendarEvent) {
    return this.#appointmentService.createAppointmentAdmin(event);
  }

  updateEvent(event: CalendarEvent) {
    return this.#appointmentService.updateAppointmentAdmin(event);
  }

  deleteEvent(ev:{id:string}) {

    return this.#appointmentService.deleteAppointment(ev as Appointment)
  }
}
