import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavLisstComponent } from './nav-lisst.component';

describe('NavLisstComponent', () => {
  let component: NavLisstComponent;
  let fixture: ComponentFixture<NavLisstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavLisstComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavLisstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
