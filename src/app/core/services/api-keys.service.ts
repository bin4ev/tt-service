import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { catchError, from, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiKeysService {
  private readonly basePath = 'keys';
  private readonly googleMapIdDoc = 'mcxxxwCiNjZETcJKCjxW';

  #db = inject(Firestore);
  collectionRef = collection(this.#db, this.basePath);

  constructor() {}

  getGoogleMapKey() {
    const docRef = doc(this.#db, this.basePath, this.googleMapIdDoc);

    return from(getDoc(docRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          return docSnap.data();
        } else {
          // docSnap.data() will be undefined in this case
          console.log('No such document!');
          return null;
        }
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      })
    );
  }
}
