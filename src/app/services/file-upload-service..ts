import { Injectable, inject } from "@angular/core";
import { FileUpload } from "../models/file-upload";
import { Observable } from "rxjs/internal/Observable";
import { getDatabase } from "@angular/fire/database";
import {
  catchError,
  concatAll,
  concatMap,
  finalize,
  map,
  mergeMap,
  scan,
  switchMap,
} from "rxjs/operators";
import { Firestore, collection, collectionData } from "@angular/fire/firestore";
import {
  Storage,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from "@angular/fire/storage";
import { from } from "rxjs/internal/observable/from";
import { concat, forkJoin, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  private basePath = "/uploads";

  private db = inject(Firestore);
  private fileStorage = inject(Storage);
  uploadsRef = collection(this.db, "uploads");
  storage: Storage = inject(Storage);

  // Create a reference under which you want to list
  listRef = ref(this.storage);

  listAllFiles() {
    return from(listAll(this.listRef)).pipe(
      mergeMap((res) =>
        forkJoin(res.items.map((itemRef) => from(getDownloadURL(itemRef)).pipe()))
      ),
      catchError((error) => {
        console.error("Error fetching images:", error);
        return throwError(() => error);
      })
    );
  }

  addFile(file:File) {
    const filePath = file.name;
    const fileRef = ref(this.storage, filePath);
    
    return from(uploadBytes(fileRef, file))
  }
}
