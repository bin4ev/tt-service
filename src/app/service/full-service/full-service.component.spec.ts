import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullServiceComponent } from './full-service.component';

describe('FullServiceComponent', () => {
  let component: FullServiceComponent;
  let fixture: ComponentFixture<FullServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
