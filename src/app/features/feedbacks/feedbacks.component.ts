import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, Signal, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import {
  catchError,
  finalize,
  map,
  of,
  shareReplay,
  startWith,
  tap,
} from 'rxjs';
import { GooglePlaceService } from 'src/app/core/services/google-place.service';
import { StarRatingComponent } from 'src/app/shared/components/star-rating/star-rating.component';
import { environment } from 'src/environments/environment.development';
import { ProcessWheelComponent } from '../../shared/components/process-wheel/process-wheel.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [
    MatCardModule,
    TranslateModule,
    AsyncPipe,
    NgOptimizedImage,
    StarRatingComponent,
    ProcessWheelComponent,
  ],
  templateUrl: './feedbacks.component.html',
  styleUrl: './feedbacks.component.scss',
})
export class FeedbacksComponent {
  #googlePlaceService = inject(GooglePlaceService);

  loading = signal(false);
  myPlaceDetails$ = this.#googlePlaceService.getMyPlaceDetails().pipe(
    shareReplay({
      bufferSize: 1,
      refCount: true,
    })
  );

  myReviews = toSignal(
    this.myPlaceDetails$.pipe(
      map((myPLaceObj) => myPLaceObj?.reviews ?? []),
      catchError((err) => of([]))
    )
  );

  myRating = toSignal(
    this.myPlaceDetails$.pipe(
      map((myPLaceObj) => myPLaceObj?.rating ?? 0),
      catchError((err) => of(0))
    )
  ) as Signal<number>;
}
