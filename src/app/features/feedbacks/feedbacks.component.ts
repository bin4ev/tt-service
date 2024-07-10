import { AsyncPipe, NgOptimizedImage } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  MatCardModule,
} from "@angular/material/card";
import { TranslateModule } from "@ngx-translate/core";
import { map, Observable, startWith, tap } from "rxjs";
import { PlaceResponse, Review } from "src/app/core/models/google-place-responce";
import { GooglePlaceService } from "src/app/core/services/google-place.service";
import { StarRatingComponent } from "src/app/shared/components/star-rating/star-rating.component";
import { environment } from "src/environments/environment.development";

@Component({
  selector: "app-feedbacks",
  standalone: true,
  imports: [MatCardModule, TranslateModule, AsyncPipe, NgOptimizedImage, StarRatingComponent],
  templateUrl: "./feedbacks.component.html",
  styleUrl: "./feedbacks.component.scss",
})
export class FeedbacksComponent {
  readonly placeId = environment.reviewsConfig.placeId;
  #googlePlaceService = inject(GooglePlaceService);

  myReviews$ = this.#googlePlaceService.myPlaceDetails$.pipe(
    tap(res => console.log(res)
    ),
    map((myPLaceObj) => myPLaceObj?.reviews ?? []));
  
}
