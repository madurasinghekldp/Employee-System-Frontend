import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../types/department';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { RoleService } from '../../services/role.service';
import { Role } from '../../types/role';
import { Employee } from '../../types/employee';
import { userStore } from '../../store/user.store';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [FormsModule,HttpClientModule,CommonModule,ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
  providers:[EmployeeService,DepartmentService,RoleService]
})
export class AddEmployeeComponent implements OnInit{

  store = inject(userStore);
    
  get user() {
    return this.store.user(); 
  }

  public departmentList:Department[] = [];
  public departmentMessage:string = "";
  public roleList:Role[] = [];
  public roleMessage:string = "";

  constructor(private readonly employeeService: EmployeeService,
              private readonly departmentService: DepartmentService,
              private readonly roleService: RoleService){
    
  }
  ngOnInit(): void {
    setTimeout(()=>{
      this.init();
    },500)
  }
  init() {
    this.departmentService.getAll(this.user?.company.id).subscribe(res=>{
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

    this.roleService.getAll(this.user?.company.id).subscribe(res=>{
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
    department: new FormControl(null,Validators.required),
    role: new FormControl(null,Validators.required)
  })

  
  public employee:Employee={
    id:null,
    firstName:null,
    lastName:null,
    email:null,
    department:null,
    role:null,
    company:undefined
  }

  addEmployee(){
    this.employee={
      id:null,
      firstName:this.employeeForm.controls.firstName?.value,
      lastName:this.employeeForm.controls.lastName?.value,
      email:this.employeeForm.controls.email?.value,
      department:this.employeeForm.controls.department?.value,
      role:this.employeeForm.controls.role?.value,
      company: this.user?.company
    }
    if(this.employeeForm.valid){
      this.employeeService.add(this.employee).subscribe(res =>{
        if(isSuccessResponse(res)){
          Swal.fire({
            title: "Success!",
            text: "New Employee Added!",
            icon: "success"
          });
          this.employeeForm.reset();
        }
        else if(isErrorResponse(res)){
          Swal.fire({
            title: "Failed!",
            text: res.message,
            icon: "error"
          });
          this.employeeForm.reset();
        }
      });
    }
  }

  submitEmployeeForm() {
    this.addEmployee();
  }

}
