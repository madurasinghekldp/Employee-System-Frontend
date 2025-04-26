import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeUpdatePopupComponent } from './employee-update-popup.component';
import { FormBuilder } from '@angular/forms';

describe('EmployeeUpdatePopupComponent', () => {
  let component: EmployeeUpdatePopupComponent;
  let fixture: ComponentFixture<EmployeeUpdatePopupComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeUpdatePopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeUpdatePopupComponent);
    component = fixture.componentInstance;

    // Create a mock form
    formBuilder = new FormBuilder();
    component.employeeForm = formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      department: [''],
      role: ['']
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
