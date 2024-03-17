import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrakesSystemComponent } from './brakes-system.component';

describe('BrakesSystemComponent', () => {
  let component: BrakesSystemComponent;
  let fixture: ComponentFixture<BrakesSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrakesSystemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrakesSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
