import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { DocumentData, Firestore, addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "@angular/fire/firestore";
import { Appointment } from "src/app/features/create-appointment/create-appointment.component";
import { NotificationService } from "./notification.service";
import { from } from "rxjs/internal/observable/from";
import { tap } from "rxjs/internal/operators/tap";
import { Observable, catchError, map, throwError } from "rxjs";
import { formatDate } from "../helpers/utils";

@Injectable({
  providedIn: "root",
})
export class AppointmentsService {
  private basePath = "appoitments";

  #db = inject(Firestore);
  #notificationService = inject(NotificationService);

  collectionRef = collection(this.#db, this.basePath);

  constructor() {}

  getAppointments():Observable<Appointment[]> {
    return from(getDocs(this.collectionRef)).pipe(
      map((querySnapshot) => {
        let results:Appointment[] = [];
        querySnapshot.forEach((doc) => results.push({ ...doc.data() as Appointment, id: doc.id }));
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

  deleteAppointment(appoitment: Appointment) {
   const refDoc = doc(this.collectionRef, appoitment.id)
    return from(deleteDoc(refDoc)).pipe(
      catchError((error) => {
        console.error("Can not delete appointment!", error);
        this.#notificationService.showError(error);
        return throwError(() => error);
      })
    );
  }
}
