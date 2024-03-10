import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { FileUploadService } from "../services/file-upload-service.";
import {
  catchError,
  concat,
  concatAll,
  concatWith,
  finalize,
  map,
  mergeAll,
  tap,
} from "rxjs/operators";
import { FileUpload } from "../models/file-upload";
import { Observable, combineLatest, forkJoin, of } from "rxjs";
import { AsyncPipe, NgOptimizedImage } from "@angular/common";
import { ProcessWheelComponent } from "../shared/process-wheel/process-wheel.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { UploadResult } from "@angular/fire/storage";

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
  ],
})
export class AboutComponent {
  uploadService = inject(FileUploadService);

  fileUploads$: Observable<any> = of(null);
  loading = false;

  ngOnInit(): void {
    this.loading = true;
    this.fileUploads$ = this.uploadService
      .listAllFiles()
      .pipe(finalize(() => (this.loading = false)));
  }

  uploadonFileSelectedImg(inputEvent: any) {
    const files: FileList = inputEvent.target.files;
    let uploads: Observable<UploadResult>[] = [];
    this.loading = true
    for (let i = 0; i < files.length; i++) {
      const file: File | null = files.item(i);
      if (file) {
        let obs$ = this.uploadService.addFile(file);
        uploads.push(obs$);
      }
    }
  
    forkJoin(uploads).pipe(
      finalize(() => this.loading = false),
      concatAll(),
      catchError((err) => {
        console.error(err);
        return of(null);
      })
    ).subscribe({
      next: () => console.log('success upload')
    })
  }
}
