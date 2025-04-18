import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Salary } from '../../types/salary';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeService } from '../../services/employee.service';
import { SalaryService } from '../../services/salary.service';
import { Employee } from '../../types/employee';
import { userStore } from '../../store/user.store';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { CommonModule, NgFor } from '@angular/common';
import Swal from 'sweetalert2';
import { Department } from '../../types/department';
import { DepartmentService } from '../../services/department.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-salary',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, NgFor, CommonModule,SpinnerComponent],
  templateUrl: './salary.component.html',
  styleUrl: './salary.component.css',
  providers:[EmployeeService,SalaryService,DepartmentService]
})
export class SalaryComponent implements OnInit {

  store = inject(userStore);

  user = computed(() => this.store.user());
  loading: boolean = false;

  public employeeList: Employee[] = [];
  public salaryList: Salary[] = [];
  public departmentList:Department[] = [];
  public salariesMessage: string = "";
  private readonly limit: number = 5;
  public offset: number = 0;
  public isGoingToUpdate: boolean = false;
  public updatingSalaryId: number = 0;

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly salaryService: SalaryService,
    private readonly departmentService:DepartmentService
  ) {
      effect(()=>{
            this.init();
          })
    }

  ngOnInit(): void {
    this.init();
  }

  init() {
      if(this.store.user()){
        this.departmentService.getAll(this.user()?.company.id).subscribe(res=>{
          if(isSuccessResponse(res)){
            this.departmentList = res.data;
          }
          else if(isErrorResponse(res)){
            this.departmentList = [];
          }
          else{
            this.departmentList = [];
          }
        })
      }
  }

  salary: Salary = {
    id: null,
    employee: null,
    payment: 0,
    paymentDate: ""
  };

  salaryForm = new FormGroup({
    department: new FormControl<Department | null>(null,Validators.required),
    employee: new FormControl<Employee | null>(null, Validators.required),
    payment: new FormControl(0, Validators.required),
    paymentDate: new FormControl('', Validators.required)
  });

  submitSalary() {
    if (this.salaryForm.valid) {
      this.salary = {
        id: null,
        employee: this.salaryForm.controls.employee.value,
        payment: this.salaryForm.controls.payment.value,
        paymentDate: this.salaryForm.controls.paymentDate.value
      };
      this.loading = true;
      this.salaryService.createSalary(this.salary).subscribe(res => {
        this.loading = false;
        if (isSuccessResponse(res)) {
          Swal.fire({ title: "Success!", text: "Salary Added!", icon: "success" });
          this.loadSalaries();
        }
        else if(isErrorResponse(res)){
          Swal.fire({
            title: "Failed!",
            text: res.message,
            icon: "error"
          });
        }
         else {
          Swal.fire({ title: "Failed!", text: "Unknown error occurred!", icon: "error" });
        }
      });
      this.salaryForm.controls.payment.reset();
      this.salaryForm.controls.paymentDate.reset();
    }
    else{
      this.salaryForm.controls.employee.markAsTouched();
    }
  }

  employeeSelected() {
    this.loadSalaries();
  }

  departmentSelected(){
    if(this.store.user()){
      this.employeeService.getAllByCompany(this.user()?.company.id,this.salaryForm.controls.department.value?.id).subscribe(res=>{
        if(isSuccessResponse(res)){
          this.employeeList = res.data;
        }
        else if(isErrorResponse(res)){
          this.employeeList = [];
        }
        else{
          this.employeeList = [];
        }
      })
    }
  }

  goToPreviousPage() {
    if (this.offset > 0) {
      this.offset -= 5;
      this.loadSalaries();
    }
  }

  goToNextPage() {
    this.offset += 5;
    this.loadSalaries();
  }

  loadSalaries() {
    if (this.salaryForm.controls.employee.valid && this.salaryForm.controls.employee.value != null) {
      const employeeSelected: Employee = this.salaryForm.controls.employee.value;
      this.salaryService.getAllSalaries(this.limit, this.offset, employeeSelected.id).subscribe(res => {
        if (isSuccessResponse(res)) {
          this.salaryList = res.data;
          this.salariesMessage = "";
        } 
        else if(isErrorResponse(res)){
          this.salaryList = [];
          this.salariesMessage = "Salaries not found";
        }
        else{
          this.salaryList = [];
          this.salariesMessage = "Unexpected error occurred";
        }
      });
    }
  }

  onEdit(salary: any) {
    this.isGoingToUpdate = true;
    this.updatingSalaryId = salary.id;
    this.salaryForm.patchValue({
      payment: salary.payment,
      paymentDate: salary.paymentDate ? new Date(salary.paymentDate).toISOString().split('T')[0] : ''
    });
  }

  updateSalary() {
    if (this.salaryForm.valid) {
      this.salary = {
        id: this.updatingSalaryId,
        employee: this.salaryForm.controls.employee.value,
        payment: this.salaryForm.controls.payment.value,
        paymentDate: this.salaryForm.controls.paymentDate.value
      };
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You want to update this salary?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          this.salaryService.updateSalary(this.salary).subscribe(res => {
            this.loading = false;
            if (isSuccessResponse(res)) {
              Swal.fire({ title: "Success!", text: "Salary Updated!", icon: "success" });
              this.isGoingToUpdate = false;
              this.updatingSalaryId = 0;
              this.loadSalaries();
            } 
            else if(isErrorResponse(res)){
              Swal.fire({
                title: "Failed!",
                text: res.message,
                icon: "error"
              });
              this.isGoingToUpdate = false;
              this.updatingSalaryId= 0;
            }
            else{
              Swal.fire({
                title: "Failed!",
                text: "Unkown error occurred!",
                icon: "error"
              });
              this.isGoingToUpdate = false;
              this.updatingSalaryId= 0;
            }
          });
        }
      });
    }
    this.salaryForm.controls.payment.reset();
    this.salaryForm.controls.paymentDate.reset();
  }

  onDelete(salary: Salary) {
    if (salary) {
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
        confirmButtonText: "Yes, Delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          this.salaryService.deleteSalary(salary.id).subscribe(res => {
            this.loading = false;
            if (isSuccessResponse(res)) {
              Swal.fire({ title: "Success!", text: "Salary Deleted!", icon: "success" });
              this.loadSalaries();
            }
            else if(isErrorResponse(res)){
              Swal.fire({
                title: "Failed!",
                text: res.message,
                icon: "error"
              });
            }
            else{
              Swal.fire({
                title: "Failed!",
                text: "Unkown error occurred!",
                icon: "error"
              });
            }
          });
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Salary has not been deleted.",
            icon: "error"
          });
        }
      });
    }
  }
}
