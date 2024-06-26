import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { DocumentData, Firestore, collection, getDocs } from "@angular/fire/firestore";
import { Appointment } from "src/app/features/create-appointment/create-appointment.component";
import { NotificationService } from "./notification.service";
import { from } from "rxjs/internal/observable/from";
import { tap } from "rxjs/internal/operators/tap";
import { map, shareReplay } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AppointmentsService {
  private basePath = "appoitments";

  #db = inject(Firestore);
  #notificationService = inject(NotificationService);

  constructor() {}

  getAppointments() {
    const collectionRef = collection(this.#db, this.basePath);
    return from(getDocs(collectionRef)).pipe(
      map((querySnapshot) => {
        let results: DocumentData[] = [];
        querySnapshot.forEach((doc) => results.push(doc.data()));
        return results;
      }),
      shareReplay()
    );
  }

  getAppointmentByDate(date: Date) {}

  createAppointment(appoitment: Appointment) {
    console.log(appoitment);
  }

  deleteAppointment() {}
}
