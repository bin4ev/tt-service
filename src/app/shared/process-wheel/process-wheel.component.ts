import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'process-wheel',
  templateUrl: './process-wheel.component.html',
  styleUrls: ['./process-wheel.component.scss'],
  standalone:true
})
export class ProcessWheelComponent implements OnInit {
  @Input() shown: boolean = false;
  @Input() width: number = 85;
  @Input() height: number = 85;

  constructor() { }

  ngOnInit(): void {
  }

}
