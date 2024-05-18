import { Component, inject } from "@angular/core";

import {
  catchError,
  concatAll,
  finalize,
  tap,
} from "rxjs/operators";

import { Observable, forkJoin, of } from "rxjs";
import { AsyncPipe, NgClass, NgOptimizedImage } from "@angular/common";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { UploadResult } from "@angular/fire/storage";
import { MatDialog } from "@angular/material/dialog";


import { TranslateModule } from "@ngx-translate/core";
import { FileUploadService } from "src/app/core/services/file-upload-service.";
import { AuthService } from "src/app/core/services/auth.service";
import { FileUpload } from "src/app/core/models/file-upload";
import { ConfirmationDialogComponent } from "src/app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { ProcessWheelComponent } from "src/app/shared/components/process-wheel/process-wheel.component";

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
    TranslateModule
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
