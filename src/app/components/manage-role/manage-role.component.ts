import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-role',
  standalone: true,
  imports: [FormsModule,NgFor],
  templateUrl: './manage-role.component.html',
  styleUrl: './manage-role.component.css'
})
export class ManageRoleComponent {
  roles = [
    // Sample roles, you can fetch this from a backend or service
    { id: 1, name: 'Manager', description: 'Manages team' },
    { id: 2, name: 'Developer', description: 'Develops software' },
  ];

  newRole = {
    id: 0, // Will be auto-generated
    name: '',
    description: ''
  };

  isEditing = false;
  editingIndex: number | null = null;

  addRole() {
    if (this.isEditing) {
      // Save changes if editing an existing role
      if (this.editingIndex !== null) {
        this.roles[this.editingIndex] = { ...this.newRole };
      }
      this.isEditing = false;
      this.editingIndex = null;
    } else {
      // Generate a new ID for the role
      const newId = this.roles.length + 1;
      this.roles.push({ ...this.newRole, id: newId });
    }

    // Clear the form
    this.newRole = { id: 0, name: '', description: '' };
  }

  editRole(role: any) {
    // Load the role details into the form for editing
    this.newRole = { ...role };
    this.isEditing = true;
    this.editingIndex = this.roles.findIndex(r => r.id === role.id);
  }

  deleteRole(id: number) {
    // Remove the role by ID
    this.roles = this.roles.filter(role => role.id !== id);
  }
}
