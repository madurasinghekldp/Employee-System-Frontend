import { Routes } from '@angular/router';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { ViewEmployeesComponent } from './components/view-employees/view-employees.component';
import { HomeComponent } from './components/home/home.component';
import { ManageDepartmentComponent } from './components/manage-department/manage-department.component';
import { ManageRoleComponent } from './components/manage-role/manage-role.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
    {
        path:"",
        component: HomeComponent
    },
    {
        path:"home",
        component: HomeComponent
    },
    {
        path:"add-employee",
        component: AddEmployeeComponent
    },
    {
        path:"view-employee",
        component: ViewEmployeesComponent
    },
    {
        path:"manage-department",
        component: ManageDepartmentComponent
    },
    {
        path:"manage-role",
        component: ManageRoleComponent
    },
    {
        path:"about",
        component: AboutComponent
    }
];
