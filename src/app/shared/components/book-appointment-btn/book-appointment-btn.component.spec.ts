import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAppointmentBtnComponent } from './book-appointment-btn.component';

describe('BookAppointmentBtnComponent', () => {
  let component: BookAppointmentBtnComponent;
  let fixture: ComponentFixture<BookAppointmentBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookAppointmentBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookAppointmentBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
