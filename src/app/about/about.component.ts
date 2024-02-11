import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  posts: string[] = [];

  ngOnInit(): void {
  }
}
