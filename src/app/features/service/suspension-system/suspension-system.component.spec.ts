import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspensionSystemComponent } from './suspension-system.component';

describe('SuspensionSystemComponent', () => {
  let component: SuspensionSystemComponent;
  let fixture: ComponentFixture<SuspensionSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuspensionSystemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuspensionSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
