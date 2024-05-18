import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessWheelComponent } from './process-wheel.component';

describe('ProcessWheelComponent', () => {
  let component: ProcessWheelComponent;
  let fixture: ComponentFixture<ProcessWheelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessWheelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
