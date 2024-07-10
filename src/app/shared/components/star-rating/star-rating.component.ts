import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [NgClass],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss'
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  starFills: number[] = [];

  ngOnChanges(): void {
    this.calculateStarFills();
  }

  private calculateStarFills(): void {
    this.starFills = [];
    let remainingRating = this.rating;

    for (let i = 1; i <= 5; i++) {
      if (remainingRating >= 1) {
        this.starFills.push(100);
      } else if (remainingRating > 0) {
        this.starFills.push(remainingRating * 100);
      } else {
        this.starFills.push(0);
      }
      remainingRating--;
    }
  }
}
