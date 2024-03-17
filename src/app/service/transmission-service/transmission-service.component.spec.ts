import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmissionServiceComponent } from './transmission-service.component';

describe('TransmissionServiceComponent', () => {
  let component: TransmissionServiceComponent;
  let fixture: ComponentFixture<TransmissionServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransmissionServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransmissionServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
