import { Routes } from '@angular/router';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { ViewEmployeesComponent } from './components/view-employees/view-employees.component';

export const routes: Routes = [
    {
        path:"add-employee",
        component: AddEmployeeComponent
    },
    {
        path:"view-employee",
        component: ViewEmployeesComponent
    }
];
