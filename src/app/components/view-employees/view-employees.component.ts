import { NgFor } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-employees',
  standalone: true,
  imports: [HttpClientModule,FormsModule,NgFor],
  templateUrl: './view-employees.component.html',
  styleUrl: './view-employees.component.css'
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

  constructor(private http: HttpClient) {
    this.loadEmployeeTable();
  }

  loadEmployeeTable(){
    this.http.get("http://localhost:8080/emp/get-all").subscribe(res=>{
      this.employeeList = res;
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
        this.http.delete(`http://localhost:8080/emp/del/${employee.id}`,{responseType:"text"}).subscribe(res=>{
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
          this.http.put(`http://localhost:8080/emp/update`,this.selectedEmployee).subscribe(res=>{
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

}
