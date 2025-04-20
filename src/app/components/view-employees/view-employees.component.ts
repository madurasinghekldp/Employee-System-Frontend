import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, computed, effect, inject, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../types/employee';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../types/department';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { RoleService } from '../../services/role.service';
import { Role } from '../../types/role';
import { EmployeeUpdatePopupComponent } from '../employee-update-popup/employee-update-popup.component';
import { userStore } from '../../store/user.store';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-employees',
  standalone: true,
  imports: [HttpClientModule,FormsModule,NgFor,NgIf,ReactiveFormsModule,EmployeeUpdatePopupComponent,SpinnerComponent],
  templateUrl: './view-employees.component.html',
  styleUrl: './view-employees.component.css',
  providers:[EmployeeService,DepartmentService,RoleService]
})
export class ViewEmployeesComponent implements OnInit{

  store = inject(userStore);
    
  user = computed(() => this.store.user());
  loading:boolean = false;

  private readonly limit:number = 5;
  public offset:number = 0;
  public searchText:string = '';
  public employeeList:Employee[] = [];
  public employeeMessage:string = "";
  public departmentList:Department[] = [];
  public departmentMessage:string = "";
  public roleList:Role[] = [];
  public roleMessage:string = "";

  public selectedEmployee:Employee = {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    department: null,
    role: null,
    company: undefined,
    user: null
  } 

  employeeForm = new FormGroup({
    firstName: new FormControl('',[Validators.required]),
    lastName: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    department: new FormControl(this.selectedEmployee.department,Validators.required),
    role: new FormControl(this.selectedEmployee.role,Validators.required)
  })

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly departmentService: DepartmentService,
    private readonly roleService: RoleService,
    private readonly router: Router,
  ) {
    effect(()=>{
      this.init();
      this.loadEmployeeTable();
    });
  }
  ngOnInit(): void {
    
  }


  onInputChange(value: string): void {
    this.loadEmployeeTable();
  }

  init(){
    this.departmentService.getAll(this.user()?.company?.id).subscribe(res=>{
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

    this.roleService.getAll(this.user()?.company?.id).subscribe(res=>{
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

  goToCalPage(id:number|null){
    this.router.navigate(['/performance-cal'], {
      queryParams: { employeeId: id}
    });
  }

  loadEmployeeTable(){
    this.employeeService.getAll(this.user()?.company?.id,this.limit,this.offset,this.searchText).subscribe(res=>{
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

  deleteEmployee(employee:Employee){
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
          if(isSuccessResponse(res)){
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "Employee has been deleted.",
              icon: "success"
            });
          }
          else if(isErrorResponse(res)){
            swalWithBootstrapButtons.fire({
              title: "Cannot delete!",
              text: res.message,
              icon: "error"
            });
          }
          this.loadEmployeeTable();
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
    this.selectedEmployee = {...employee};
    this.employeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: this.departmentList.find(dep => dep.id === employee.department?.id),
      role: this.roleList.find(role => role.id === employee.role?.id)
    })
  }

  prepareToUpdate(){
    this.selectedEmployee.firstName = this.employeeForm.controls.firstName.value;
    this.selectedEmployee.lastName = this.employeeForm.controls.lastName.value;
    this.selectedEmployee.email = this.employeeForm.controls.email.value;
    this.selectedEmployee.department = this.employeeForm.controls.department.value;
    this.selectedEmployee.role = this.employeeForm.controls.role.value;
  }
  updateEmployee(){
    this.prepareToUpdate();
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
          this.loading = true;
          this.employeeService.update(this.selectedEmployee).subscribe(res=>{
            this.loading = false;
            if(isSuccessResponse(res)){
              this.loadEmployeeTable();
              swalWithBootstrapButtons.fire({
                title: "Updated!",
                text: "Employee has been updated.",
                icon: "success"
              });
            }
            else if(isErrorResponse(res)){
              swalWithBootstrapButtons.fire({
                title: "Update Error!",
                text: res.message,
                icon: "error"
              });
            }
            else{
              swalWithBootstrapButtons.fire({
                title: "Update Error!",
                text: "Employee has not been updated.",
                icon: "error"
              });
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
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
