import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../types/department';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { RoleService } from '../../services/role.service';
import { Role } from '../../types/role';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [FormsModule,HttpClientModule,CommonModule,ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
  providers:[EmployeeService,DepartmentService,RoleService]
})
export class AddEmployeeComponent implements OnInit{

  public departmentList:Department[] = [];
  public departmentMessage:string = "";
  public roleList:Role[] = [];
  public roleMessage:string = "";

  constructor(private employeeService: EmployeeService,
              private departmentService: DepartmentService,
              private roleService: RoleService){
    
  }
  ngOnInit(): void {
    this.init();
  }
  init() {
    this.departmentService.getAll().subscribe(res=>{
      if(isSuccessResponse(res)){
        this.departmentList = res.data;
        this.departmentMessage = "";
      }
      else if(isErrorResponse(res)){
        this.departmentList = [];
        this.departmentMessage = res.message;
      }
      else{
        this.departmentList = [];
        this.departmentMessage = "Unexpected error occurred";
      }
    });

    this.roleService.getAll().subscribe(res=>{
      if(isSuccessResponse(res)){
        this.roleList = res.data;
        this.roleMessage = "";
      }
      else if(isErrorResponse(res)){
        this.roleList = [];
        this.roleMessage = res.message;
      }
      else{
        this.roleList = [];
        this.roleMessage = "Unexpected error occurred";
      }
    });
  }

  employeeForm = new FormGroup({
    firstName: new FormControl('',[Validators.required]),
    lastName: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    department: new FormControl('',Validators.required),
    role: new FormControl('',Validators.required)
  })

  departments = [
    { id: 1, name: 'Human Resources' },
    { id: 2, name: 'IT Department' },
    { id: 3, name: 'Finance' },
    { id: 4, name: 'Marketing' }
  ];

  roles = [
    { id: 1, name: 'Manager' },
    { id: 2, name: 'Developer' },
    { id: 3, name: 'Analyst' },
    { id: 4, name: 'HR Specialist' }
  ];

  public employee={
    id:undefined,
    firstName:undefined,
    lastName:undefined,
    email:undefined,
    department:undefined,
    role:undefined
  }

  /* addEmployee(){
    console.log(this.employee);
    this.employeeService.add(this.employee).subscribe(data =>{

      Swal.fire({
        title: "Success!",
        text: "New Employee Added!",
        icon: "success"
      });
      this.employee={
        id:undefined,
        firstName:undefined,
        lastName:undefined,
        email:undefined,
        department:undefined,
        role:undefined
      }
    });
  } */

  submitEmployeeForm() {
    console.log(this.employeeForm);
  }

}
