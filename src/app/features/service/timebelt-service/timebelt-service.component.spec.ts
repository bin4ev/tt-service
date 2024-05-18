import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimebeltServiceComponent } from './timebelt-service.component';

describe('TimebeltServiceComponent', () => {
  let component: TimebeltServiceComponent;
  let fixture: ComponentFixture<TimebeltServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimebeltServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimebeltServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
