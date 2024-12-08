import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-department-update-popup',
  standalone: true,
  imports: [FormsModule,NgIf,NgFor,ReactiveFormsModule],
  templateUrl: './department-update-popup.component.html',
  styleUrl: './department-update-popup.component.css'
})
export class DepartmentUpdatePopupComponent {
  @Input() departmentFormUpdate!: FormGroup;
  @Output() updateDepartment = new EventEmitter<void>(); 

}
