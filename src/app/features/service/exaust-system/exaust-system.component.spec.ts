import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaustSystemComponent } from './exaust-system.component';

describe('ExaustSystemComponent', () => {
  let component: ExaustSystemComponent;
  let fixture: ComponentFixture<ExaustSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExaustSystemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExaustSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
