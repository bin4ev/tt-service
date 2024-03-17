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
  tap,
} from "rxjs/operators";
import { Firestore, collection, collectionData } from "@angular/fire/firestore";
import {
  Storage,
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from "@angular/fire/storage";
import { from } from "rxjs/internal/observable/from";
import { concat, forkJoin, pipe, throwError } from "rxjs";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  private basePath = "uploads";

  private db = inject(Firestore);
  private storage: Storage = inject(Storage);
  private notificationService = inject(NotificationService);
  
  uploadsRef = collection(this.db, "uploads");

  // Create a reference under which you want to list
  listRef = ref(this.storage);

  listAllFiles() {
    return from(listAll(this.listRef)).pipe(
      mergeMap((res) =>
        forkJoin(
          res.items.map((itemRef) =>
            from(getDownloadURL(itemRef)).pipe(
              map((url) => ({ name: itemRef.name, url })),
              catchError((error) => throwError(() => error))
            )
          )
        )
      ),
      catchError((error) => {
        console.error("Error fetching images:", error);
        this.notificationService.showError("Error fetching images");
        return throwError(() => error);
      })
    );
  }

  addFile(file: File) {
    const filePath = file.name;
    const fileRef = ref(this.storage, filePath);

    return from(uploadBytes(fileRef, file)).pipe(
      tap(()=>this.notificationService.showSuccess("File iploaded")),
      catchError((error) => {
        console.error("Error upload file:", error);
        this.notificationService.showError("Error upload file");
        return throwError(() => error);
      })
    )
  }

  deleteFile(file: FileUpload) {
    const fileRef = ref(this.storage, file.name);
    return from(deleteObject(fileRef)).pipe(
      tap(()=>this.notificationService.showSuccess("File deleted")),
      catchError((error) => {
        console.error("Error deleting file:", error);
        this.notificationService.showError("Error deleting file");
        return throwError(() => error);
      })
    );
  }
}
