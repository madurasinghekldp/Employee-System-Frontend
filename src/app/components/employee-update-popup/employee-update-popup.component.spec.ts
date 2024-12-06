import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeUpdatePopupComponent } from './employee-update-popup.component';

describe('EmployeeUpdatePopupComponent', () => {
  let component: EmployeeUpdatePopupComponent;
  let fixture: ComponentFixture<EmployeeUpdatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeUpdatePopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeUpdatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
