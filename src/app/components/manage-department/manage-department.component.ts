import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department } from '../../types/department';
import { DepartmentService } from '../../services/department.service';
import { HttpClientModule } from '@angular/common/http';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-department',
  standalone: true,
  imports: [NgFor,FormsModule,ReactiveFormsModule,NgIf,HttpClientModule],
  templateUrl: './manage-department.component.html',
  styleUrl: './manage-department.component.css',
  providers:[DepartmentService]
})
export class ManageDepartmentComponent implements OnInit {

  private readonly limit:number = 5;
  public offset:number = 0;
  public departmentList:Department[] = [];
  public departmentMessage:string = "";

  departmentForm = new FormGroup({
    name: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required)
  })

  departmentFormUpdate = new FormGroup({
    name: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required)
  })

  constructor(private departmentService: DepartmentService){

  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(){
    this.departmentService.getAllSelected(this.limit,this.offset).subscribe(res=>{
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
    })
  }

  goToNextPage(){
    this.offset +=5 ;
    this.loadDepartments();
  }

  goToPreviousPage(){
    if(this.offset>0){
      this.offset -= 5;
      this.loadDepartments();
    }
  }
  

  public selectedDepartment:Department = {
    id: null,
    name: null,
    description: null
  }

  public department:Department = {
    id: null,
    name: null,
    description: null
  }


  loadUpdateModel(department: Department){
    this.selectedDepartment = {...department};
    this.departmentFormUpdate.patchValue({
      name: department.name,
      description: department.description
    })
  }

  prepareToUpdate(){
    this.selectedDepartment.name = this.departmentFormUpdate.controls.name.value;
    this.selectedDepartment.description = this.departmentFormUpdate.controls.description.value;
  }

  addDepartment() {
    this.department = {
      id: null,
      name: this.departmentForm.controls.name.value,
      description: this.departmentForm.controls.description.value
    }

    this.departmentService.add(this.department).subscribe(res => {
      if(isSuccessResponse(res)){
        Swal.fire({
          title: "Success!",
          text: "New Department Added!",
          icon: "success"
        });
        this.departmentForm.reset();
        this.loadDepartments();
      }
      else if(isErrorResponse(res)){
        Swal.fire({
          title: "Failed!",
          text: res.message,
          icon: "error"
        });
        this.departmentForm.reset();
      }
    })
  }

  updateDepartment() {
    this.prepareToUpdate();
    if(this.selectedDepartment.id){
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
          this.departmentService.update(this.selectedDepartment).subscribe(res=>{
            if(isSuccessResponse(res)){
              this.loadDepartments();
              swalWithBootstrapButtons.fire({
                title: "Updated!",
                text: "Department has been updated.",
                icon: "success"
              });
            }
            else{
              swalWithBootstrapButtons.fire({
                title: "Update Error!",
                text: "Department has not been updated.",
                icon: "error"
              });
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Department has not been updated.",
            icon: "error"
          });
        }
      });
    }
  }

  deleteDepartment(department: Department) {
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
        this.departmentService.delete(department).subscribe(res=>{
          if(isSuccessResponse(res)){
            this.loadDepartments();
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "Department has been deleted.",
              icon: "success"
            });
          }
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Department has not been deleted.",
          icon: "error"
        });
      }
    });
  }

}
