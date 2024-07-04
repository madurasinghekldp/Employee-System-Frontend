import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ManageEmployeeComponent } from './components/manage-employee/manage-employee.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { ViewEmployeesComponent } from './components/view-employees/view-employees.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ManageEmployeeComponent,AddEmployeeComponent,ViewEmployeesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'emp-app';
}
