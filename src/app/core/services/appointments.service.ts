import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { DocumentData, Firestore, addDoc, collection, doc, getDocs, setDoc } from "@angular/fire/firestore";
import { Appointment } from "src/app/features/create-appointment/create-appointment.component";
import { NotificationService } from "./notification.service";
import { from } from "rxjs/internal/observable/from";
import { tap } from "rxjs/internal/operators/tap";
import { catchError, map, shareReplay, throwError } from "rxjs";
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

  getAppointments() {
   
    return from(getDocs(this.collectionRef)).pipe(
      map((querySnapshot) => {
        let results: DocumentData[] = [];
        querySnapshot.forEach((doc) => results.push(doc.data()));
        return results;
      }),
    );
  }

  getAppointmentByDate(date: Date) {}

  createAppointment(appoitment: Appointment) {
    const parsedDate = formatDate(appoitment.date as Date)
    let bodyToSend = {
      ...appoitment,
      date: parsedDate
    }
   
    return from(addDoc(this.collectionRef, bodyToSend,)).pipe(
      catchError((error) => {
        console.error("Can not create appointment!", error);
        this.#notificationService.showError(error);
        return throwError(() => error);
      })
    )
  }

  deleteAppointment() {}
}
