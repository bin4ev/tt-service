import { Component, inject } from "@angular/core";
import { FileUploadService } from "../services/file-upload-service.";
import {
  catchError,
  concatAll,
  finalize,
  tap,
} from "rxjs/operators";
import { FileUpload } from "../models/file-upload";
import { Observable, forkJoin, of } from "rxjs";
import { AsyncPipe, NgClass, NgOptimizedImage } from "@angular/common";
import { ProcessWheelComponent } from "../shared/process-wheel/process-wheel.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { UploadResult } from "@angular/fire/storage";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../shared/confirmation-dialog/confirmation-dialog.component";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-about",
  standalone: true,
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
  imports: [
    AsyncPipe,
    ProcessWheelComponent,
    NgOptimizedImage,
    MatButtonModule,
    MatIconModule,
    NgClass,
  ],
})
export class AboutComponent {
  uploadService = inject(FileUploadService);
  matDialog = inject(MatDialog);
  authService = inject(AuthService);
  
  fileUploads$: Observable<any> = of(null);
  loading = false;
  selectedFiles = new Set<FileUpload>();
  isLoggedIn = false

  constructor() {
 
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn
    this.getAllFiles();
  }

  getAllFiles() {
    this.loading = true;
    this.fileUploads$ = this.uploadService
      .listAllFiles()
      .pipe(finalize(() => (this.loading = false)));
  }

  uploadonFileSelectedImg(inputEvent: any) {
    const files: FileList = inputEvent.target.files;
    let uploads: Observable<UploadResult>[] = [];
    this.loading = true;
    for (let i = 0; i < files.length; i++) {
      const file: File | null = files.item(i);
      if (file) {
        let obs$ = this.uploadService.addFile(file);
        uploads.push(obs$);
      }
    }

    forkJoin(uploads)
      .pipe(
        finalize(() => (this.loading = false)),
        concatAll(),
        catchError((err) => {
          console.error(err);
          return of(null);
        })
      )
      .subscribe({
        next: () => this.getAllFiles(),
      });
  }

  deleteFile(file: FileUpload) {
    console.log(file);

    this.selectedFiles.add(file);
    this.matDialog
      .open(ConfirmationDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.uploadService
            .deleteFile(file)
            .pipe(
              finalize(() => this.selectedFiles.delete(file)),
              tap(() =>this.getAllFiles())
            )
            .subscribe();
        }else {
          this.selectedFiles.delete(file);
        }
      });
  }
}
