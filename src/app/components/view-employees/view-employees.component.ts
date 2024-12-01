import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../types/employee';
import { SuccessResponse } from '../../types/success-response';
import { ErrorResponse } from '../../types/error-response';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../types/department';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';

@Component({
  selector: 'app-view-employees',
  standalone: true,
  imports: [HttpClientModule,FormsModule,NgFor,NgIf],
  templateUrl: './view-employees.component.html',
  styleUrl: './view-employees.component.css',
  providers:[EmployeeService,DepartmentService]
})
export class ViewEmployeesComponent implements OnInit{

  private readonly limit:number = 5;
  public offset:number = 0;
  public employeeList:Employee[] = [];
  public employeeMessage:string = "";
  public departmentList:Department[] = [];

  public selectedEmployee:Employee = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    department: {
      id: 0,
      name: '',
      description: ''
    },
    role: {
      id: 0,
      name: '',
      description: ''
    }
  } 

  constructor(
    private http: HttpClient, 
    private employeeService: EmployeeService,
    private departmentService: DepartmentService) {
    this.loadEmployeeTable();
  }
  ngOnInit(): void {
    this.init();
  }

  init(){
    this.departmentService.getAll().subscribe(res=>{
      
    })
  }

  goToNextPage(){
    this.offset +=5 ;
    this.loadEmployeeTable();
  }

  goToPreviousPage(){
    if(this.offset>0){
      this.offset -= 5;
      this.loadEmployeeTable();
    }
  }

  loadEmployeeTable(){
    this.employeeService.getAll(this.limit,this.offset).subscribe(res=>{
      if (isSuccessResponse(res)) {
        this.employeeList = res.data;
        this.employeeMessage = "";
      } else if (isErrorResponse(res)) {
        this.employeeMessage = res.message;
        this.employeeList = [];
      } else {
        this.employeeMessage = "Unexpected error occurred";
        this.employeeList = [];
      }
    });
  }

  deleteEmployee(employee:any){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.delete(employee).subscribe(res=>{
          this.loadEmployeeTable();
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Employee has been deleted.",
            icon: "success"
          });
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Employee has not been deleted.",
          icon: "error"
        });
      }
    });
  }

  loadUpdateModel(employee:Employee){
    this.selectedEmployee.id = employee.id;
    this.selectedEmployee.firstName = employee.firstName;
    this.selectedEmployee.lastName = employee.lastName;
    this.selectedEmployee.email = employee.email;
    this.selectedEmployee.department = employee.department;
    this.selectedEmployee.role = employee.role;
  }

  updateEmployee(){
    if(this.selectedEmployee.id){
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.employeeService.update(this.selectedEmployee).subscribe(res=>{
            this.loadEmployeeTable();
            swalWithBootstrapButtons.fire({
              title: "Updated!",
              text: "Employee has been updated.",
              icon: "success"
            });
          });
        } else if (
          
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Employee has not been updated.",
            icon: "error"
          });
        }
      });
    }
  }

}
