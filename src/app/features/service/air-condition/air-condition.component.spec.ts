import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirConditionComponent } from './air-condition.component';

describe('AirConditionComponent', () => {
  let component: AirConditionComponent;
  let fixture: ComponentFixture<AirConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirConditionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AirConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
