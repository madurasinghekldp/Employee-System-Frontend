import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ManageEmployeeComponent } from './components/manage-employee/manage-employee.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { ViewEmployeesComponent } from './components/view-employees/view-employees.component';
import { HeaderComponent } from './components/header/header.component';
import { EmployeeUpdatePopupComponent } from './components/employee-update-popup/employee-update-popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ManageEmployeeComponent,AddEmployeeComponent,ViewEmployeesComponent,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'emp-app';
}