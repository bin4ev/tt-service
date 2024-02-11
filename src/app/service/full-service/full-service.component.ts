import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-full-service',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './full-service.component.html',
  styleUrl: './full-service.component.scss'
})
export class FullServiceComponent {

}
