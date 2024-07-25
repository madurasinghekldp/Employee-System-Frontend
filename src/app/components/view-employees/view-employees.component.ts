import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-view-employees',
  standalone: true,
  imports: [HttpClientModule,FormsModule,NgFor,NgIf],
  templateUrl: './view-employees.component.html',
  styleUrl: './view-employees.component.css',
  providers:[EmployeeService]
})
export class ViewEmployeesComponent {

  public employeeList:any = [];

  public selectedEmployee = {
    id:undefined,
    firstName:undefined,
    lastName:undefined,
    email:undefined,
    departmentId:undefined,
    roleId:undefined
  }

  public lowRange:number = -1;
  public highRange:number = 7;
  public employeeCount:any;

  constructor(private http: HttpClient, private employeeService: EmployeeService) {
    this.loadEmployeeTable();
    this.getEmployeeCount();
  }

  loadEmployeeTable(){
    this.employeeService.getAll().subscribe(res=>{
      this.employeeList = res;
      this.employeeList.sort((a: { id: number; },b: { id: number; })=> b.id - a.id);
    });
  }

  getEmployeeCount(){
    this.employeeService.getCount().subscribe(
      res=>this.employeeCount = res
    );
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

  loadUpdateModel(employee:any){
    this.selectedEmployee.id = employee.id;
    this.selectedEmployee.firstName = employee.firstName;
    this.selectedEmployee.lastName = employee.lastName;
    this.selectedEmployee.email = employee.email;
    this.selectedEmployee.departmentId = employee.departmentId;
    this.selectedEmployee.roleId = employee.roleId;
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
          /* Read more about handling dismissals below */
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

  increaseRange(){
    this.lowRange = this.lowRange+7;
    this.highRange = this.highRange+7;
  }

  decreaseRange(){
    this.lowRange = this.lowRange-7;
    this.highRange = this.highRange-7;
  }

}
