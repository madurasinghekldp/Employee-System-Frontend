import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [FormsModule,HttpClientModule,CommonModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
  providers:[EmployeeService]
})
export class AddEmployeeComponent {

  constructor(private employeeService: EmployeeService){
    
  }

  public employee={
    firstName:undefined,
    lastName:undefined,
    email:undefined,
    departmentId:undefined,
    roleId:undefined
  }

  addEmployee(){
    console.log(this.employee);
    this.employeeService.add(this.employee).subscribe(data =>{

      Swal.fire({
        title: "Success!",
        text: "New Employee Added!",
        icon: "success"
      });
      this.employee={
        firstName:undefined,
        lastName:undefined,
        email:undefined,
        departmentId:undefined,
        roleId:undefined
      }
    });
  }

}
