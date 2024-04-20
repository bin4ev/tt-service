import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'process-wheel',
  templateUrl: './process-wheel.component.html',
  styleUrls: ['./process-wheel.component.scss'],
  standalone:true,
  imports:[TranslateModule]
})
export class ProcessWheelComponent implements OnInit {
  @Input() shown: boolean = false;
  @Input() width: number = 85;
  @Input() height: number = 85;

  constructor() { }

  ngOnInit(): void {
  }

}
