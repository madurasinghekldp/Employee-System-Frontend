import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { ViewEmployeesComponent } from './components/view-employees/view-employees.component';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { userStore } from './store/user.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AddEmployeeComponent,ViewEmployeesComponent,HeaderComponent,LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'emp-app';

  store = inject(userStore);
}