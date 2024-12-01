import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-department',
  standalone: true,
  imports: [NgFor,FormsModule],
  templateUrl: './manage-department.component.html',
  styleUrl: './manage-department.component.css'
})
export class ManageDepartmentComponent {
  departments = [
    // Sample departments, you can fetch this from a backend or service
    { id: 1, name: 'HR', description: 'Human Resources' },
    { id: 2, name: 'IT', description: 'Information Technology' },
  ];

  newDepartment = {
    id: 0, // Will be auto-generated
    name: '',
    description: ''
  };

  isEditing = false;
  editingIndex: number | null = null;

  addDepartment() {
    if (this.isEditing) {
      // Save changes if editing an existing department
      if (this.editingIndex !== null) {
        this.departments[this.editingIndex] = { ...this.newDepartment };
      }
      this.isEditing = false;
      this.editingIndex = null;
    } else {
      // Generate a new ID for the department
      const newId = this.departments.length + 1;
      this.departments.push({ ...this.newDepartment, id: newId });
    }

    // Clear the form
    this.newDepartment = { id: 0, name: '', description: '' };
  }

  editDepartment(department: any) {
    // Load the department details into the form for editing
    this.newDepartment = { ...department };
    this.isEditing = true;
    this.editingIndex = this.departments.findIndex(d => d.id === department.id);
  }

  deleteDepartment(id: number) {
    // Remove the department by ID
    this.departments = this.departments.filter(department => department.id !== id);
  }

}
