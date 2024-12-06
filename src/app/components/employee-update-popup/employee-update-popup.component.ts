import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Department } from '../../types/department';
import { Role } from '../../types/role';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-employee-update-popup',
  standalone: true,
  imports: [FormsModule,NgFor,NgIf,ReactiveFormsModule],
  templateUrl: './employee-update-popup.component.html',
  styleUrl: './employee-update-popup.component.css'
})
export class EmployeeUpdatePopupComponent implements OnInit {

  @Input() employeeForm!: FormGroup; // Form for employee details
  @Input() departmentList: Department[] = []; // List of departments
  @Input() roleList: Role[] = []; // List of roles
  @Output() updateEmployee = new EventEmitter<void>(); 
  ngOnInit(): void {
    
  }
  
}
