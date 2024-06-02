import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AppointmentsService {
  #http = inject(HttpClient);

  constructor() {}

  getAppointments() {
    return this.#http.get("http://localhost:3000/appointments");
  }

  getAppointmentByDate(date:Date) {

  }

  createAppointment() {

  }

  deleteAppointment() {

  }
}
