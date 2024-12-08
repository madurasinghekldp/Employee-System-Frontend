import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-update-popup',
  standalone: true,
  imports: [FormsModule,NgIf,NgFor,ReactiveFormsModule],
  templateUrl: './role-update-popup.component.html',
  styleUrl: './role-update-popup.component.css'
})
export class RoleUpdatePopupComponent {
  @Input() roleFormUpdate! : FormGroup;
  @Output() updateRole = new EventEmitter<void>();
}
