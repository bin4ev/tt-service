import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import {
  DocumentData,
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "@angular/fire/firestore";
import { Appointment } from "src/app/features/create-appointment/create-appointment.component";
import { NotificationService } from "./notification.service";
import { from } from "rxjs/internal/observable/from";
import { tap } from "rxjs/internal/operators/tap";
import { Observable, catchError, map, throwError } from "rxjs";
import { formatDate } from "../helpers/utils";
import { CalendarEvent } from "src/app/features/calendar/services/calendar.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AppointmentsService {
  private basePath = "appoitments";

  #db = inject(Firestore);
  #notificationService = inject(NotificationService);
  #authService = inject(AuthService);

  collectionRef = collection(this.#db, this.basePath);

  constructor() {}

  getAppointments(): Observable<Appointment[]> {
    return from(getDocs(this.collectionRef)).pipe(
      map((querySnapshot) => {
        let results: Appointment[] = [];
        querySnapshot.forEach((doc) =>
          results.push({ ...(doc.data() as any), id: doc.id })
        );
        return results;
      }),
      catchError((error) => {
        console.error("Can not fetching data!", error);
        this.#notificationService.showError(error);
        return throwError(() => error);
      })
    );
  }

  getAppointmentByDate(date: Date) {}

  createAppointment(appoitment: Appointment) {
    const parsedDate = formatDate(appoitment.date as Date);
    let bodyToSend = {
      ...appoitment,
      date: parsedDate,
    };

    return from(addDoc(this.collectionRef, bodyToSend)).pipe(
      catchError((error) => {
        console.error("Can not create appointment!", error);
        this.#notificationService.showError(error);
        return throwError(() => error);
      })
    );
  }

  createAppointmentAdmin(appoitment: CalendarEvent) {
    let bodyToSend = {
      ...appoitment,
      role: this.#authService.isLoggedIn ? "admin" : "viewer",
    };

    return from(addDoc(this.collectionRef, bodyToSend)).pipe(
      catchError((error) => {
        console.error("Can not create appointment!", error);
        this.#notificationService.showError(error);
        return throwError(() => error);
      })
    );
  }

  deleteAppointment(appoitment: Appointment) {
    const refDoc = doc(this.collectionRef, appoitment.id);
    return from(deleteDoc(refDoc)).pipe(
      catchError((error) => {
        console.error("Can not delete appointment!", error);
        this.#notificationService.showError(error);
        return throwError(() => error);
      })
    );
  }

  transformBookingToEvent(booking: Appointment): CalendarEvent {
    const dateString = booking.date as string;
    const [startTime, endTime] = booking.slot.split("-"); // e.g., "17:00", "18:00"
    const [day, month, year] = dateString.split("."); // e.g., "01", "07", "2024"

    const dateStr = `${year}-${month}-${day}`; // ISO date format

    return {
      id: booking.id,
      title: `${booking.name} - ${booking.service}`,
      start: `${dateStr}T${startTime}`,
      end: `${dateStr}T${endTime}`,
      extendedProps: {
        email: booking.email,
        phone: booking.phone,
        service: booking.service,
        ...(booking.car && { car: booking.car }), 
        ...(booking.modelYear && { modelYear: booking.modelYear }), 
        ...(booking.modification && { modification: booking.modification }),
      },
    };
  }

  transformEventToBooking(event: CalendarEvent): Appointment {
    // Extract date parts from event.start
    const startDate = new Date(event.start); // Convert Firestore timestamp to JS Date

    // Format date as "dd.MM.yyyy"
    const day = startDate.getDate().toString().padStart(2, "0");
    const month = (startDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const year = startDate.getFullYear();

    const dateString = `${day}.${month}.${year}`;

    // Extract start time "HH:mm"
    const startHours = startDate.getHours().toString().padStart(2, "0");
    const startMinutes = startDate.getMinutes().toString().padStart(2, "0");
    const startTime = `${startHours}:${startMinutes}`;

    // Extract end time "HH:mm"
    const endDate = new Date(event.end);
    const endHours = endDate.getHours().toString().padStart(2, "0");
    const endMinutes = endDate.getMinutes().toString().padStart(2, "0");
    const endTime = `${endHours}:${endMinutes}`;

    const slot = `${startTime}-${endTime}`;

    return {
      name: event.title?.split(" - ")[0] || "", // assuming your title is "name - service"
      service: event.title?.split(" - ")[1] || "",
      date: dateString,
      slot,
      email: event.extendedProps?.email || "",
      phone: event.extendedProps?.phone || "",
      car: "",
      modelYear: "",
      modification: "",
      id: event.id,
    };
  }

  updateAppointmentAdmin(appoitment: CalendarEvent) {
    
    if (!appoitment.id) {
      return throwError(() => new Error("Appointment ID is required for update."));
    }

    const refDoc = doc(this.collectionRef, appoitment.id);
    let bodyToSend = {
      ...appoitment,
      role: "admin",
    };

    return from(updateDoc(refDoc, bodyToSend)).pipe(
      catchError((error) => {
        console.error("Can not update appointment!", error);
        this.#notificationService.showError(error);
        return throwError(() => error);
      })
    );
  }
}
