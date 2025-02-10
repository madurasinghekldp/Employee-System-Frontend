import { Routes } from '@angular/router';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { ViewEmployeesComponent } from './components/view-employees/view-employees.component';
import { HomeComponent } from './components/home/home.component';
import { ManageDepartmentComponent } from './components/manage-department/manage-department.component';
import { ManageRoleComponent } from './components/manage-role/manage-role.component';
import { AboutComponent } from './components/about/about.component';
import { LayoutComponent } from './components/layout/layout.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { LeavesComponent } from './components/leaves/leaves.component';
import { SalaryComponent } from './components/salary/salary.component';

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
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
          { path: "", redirectTo: "home", pathMatch: 'full' },
          { path: "home", component: HomeComponent },
          { path: "view-employee", component: ViewEmployeesComponent },
          { path: "add-employee", component: AddEmployeeComponent },
          // Add more routes as needed
        ]
      },
      {
        path: "signup",
        component: UserRegistrationComponent
      },
      {
        path: "login",
        component: UserLoginComponent
      },
      {
        path: "add-user",
        component: AddUserComponent
      },
      {
        path: "manage-leaves",
        component: LeavesComponent
      },
      {
        path: "manage-salary",
        component: SalaryComponent
      }
];
