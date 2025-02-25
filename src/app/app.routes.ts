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
import { TasksComponent } from './components/tasks/tasks.component';
import { authGuard } from './guards/auth.guard';
import { SettingComponent } from './components/setting/setting.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AssignTasksComponent } from './components/assign-tasks/assign-tasks.component';
import { ApplyLeaveComponent } from './components/apply-leave/apply-leave.component';

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
        component: AddEmployeeComponent,
        canActivate: [authGuard]
    },
    {
        path:"view-employee",
        component: ViewEmployeesComponent,
        canActivate: [authGuard]
    },
    {
        path:"manage-department",
        component: ManageDepartmentComponent,
        canActivate: [authGuard]
    },
    {
        path:"manage-role",
        component: ManageRoleComponent,
        canActivate: [authGuard]
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
          { path: "view-employee", component: ViewEmployeesComponent ,canActivate: [authGuard]},
          { path: "add-employee", component: AddEmployeeComponent ,canActivate: [authGuard]},
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
        component: AddUserComponent,
        canActivate: [authGuard]
      },
      {
        path: "manage-leaves",
        component: LeavesComponent,
        canActivate: [authGuard]
      },
      {
        path: "manage-salary",
        component: SalaryComponent,
        canActivate: [authGuard]
      },
      {
        path: "manage-task",
        component: TasksComponent,
        canActivate: [authGuard]
      },
      {
        path: "setting",
        component: SettingComponent,
        canActivate: [authGuard]
      },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [authGuard]
      },
      {
        path: "assigned-tasks",
        component: AssignTasksComponent,
        canActivate: [authGuard]
      },
      {
        path: "apply-leaves",
        component: ApplyLeaveComponent,
        canActivate: [authGuard]
      }
];
