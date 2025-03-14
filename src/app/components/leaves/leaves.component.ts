import { Component, computed, effect, inject,OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Leaves } from '../../types/leaves';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeService } from '../../services/employee.service';
import { LeaveService } from '../../services/leave.service';
import { Employee } from '../../types/employee';
import { userStore } from '../../store/user.store';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { CommonModule, NgFor } from '@angular/common';
import Swal from 'sweetalert2';
import { Department } from '../../types/department';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,HttpClientModule,NgFor,CommonModule],
  templateUrl: './leaves.component.html',
  styleUrl: './leaves.component.css',
  providers:[EmployeeService,LeaveService,DepartmentService]
})
export class LeavesComponent implements OnInit{

  store = inject(userStore);
  
  user = computed(() => this.store.user());

  public employeeList:Employee[] = [];
  public leaveList:Leaves[] = [];
  public departmentList:Department[] = [];
  public leavesMessage:string = "";
  private readonly limit:number = 5;
  public offset:number = 0;
  public isGoingToUpdate:boolean = false;
  public updatingLeaveId:number = 0;
  public isApproved:boolean = false;

  constructor(
    private readonly employeeService:EmployeeService, 
    private readonly leaveService:LeaveService,
    private readonly departmentService:DepartmentService
  ){
    effect(()=>{
          this.init();
        })
  }

  ngOnInit(): void {
    this.init();
  }

  init(){
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

  leave:Leaves = {
    id:null,
    employee: null,
    startDate: "",
    endDate: "",
    approvedBy: null
  }

  leaveForm = new FormGroup({
    department: new FormControl<Department | null>(null,Validators.required),
    employee: new FormControl<Employee | null>(null,Validators.required),
    startDate: new FormControl('',Validators.required),
    endDate: new FormControl('',Validators.required),
    approved: new FormControl(false)
  });

  departmentSelected(){
    if(this.store.user()){
      this.employeeService.getAllByCompany(this.user()?.company.id,this.leaveForm.controls.department.value?.id).subscribe(res=>{
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

  employeeSelected(){
    this.loadLeaves();
    this.leaveForm.controls.startDate.reset();
    this.leaveForm.controls.endDate.reset();
    this.leaveForm.controls.approved.reset();
  }

  goToPreviousPage(){
    if(this.offset>0){
      this.offset -= 5;
      this.loadLeaves();
    }
  }

  goToNextPage(){
    this.offset +=5 ;
    this.loadLeaves();
  }

  loadLeaves(){
    if(this.leaveForm.controls.employee.valid && this.leaveForm.controls.employee.value!=null){
      const employeeSelected:Employee = this.leaveForm?.controls?.employee?.value;
      this.leaveService.getAllLeaves(this.limit,this.offset,employeeSelected.id).subscribe(res=>{
        if(isSuccessResponse(res)){
          this.leaveList = res.data;
          this.leavesMessage = "";
        }
        else if(isErrorResponse(res)){
          this.leaveList = [];
          this.leavesMessage = "Leaves not found";
        }
        else{
          this.leaveList = [];
          this.leavesMessage = "Unexpected error occurred";
        }
      })
    }
  }

  onEdit(leave:any){
    this.isGoingToUpdate = true;
    this.updatingLeaveId= leave.id;
    this.leaveForm.patchValue({
      startDate: leave.startDate ? new Date(leave.startDate).toISOString().split('T')[0] : '',
      endDate: leave.endDate ? new Date(leave.endDate).toISOString().split('T')[0] : '',
      approved: leave.approvedBy!=null
    });
    console.log(this.leaveForm);
  }

  updateLeave(){
    if(this.leaveForm.valid){
      this.leave = {
        id:this.updatingLeaveId,
        employee: this.leaveForm.controls.employee.value,
        startDate: this.leaveForm.controls.startDate.value,
        endDate: this.leaveForm.controls.endDate.value,
        approvedBy: this.leaveForm.controls.approved? {
          id:this.user()?.id,
          firstName:null,
          lastName:null,
          email:null,
          password:null,
          userRoleName:null,
          company:null
        }:null
      }
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
      }).then((result)=>{
        if (result.isConfirmed) {
          this.leaveService.updateLeave(this.leave).subscribe(res=>{
            if(isSuccessResponse(res)){
              Swal.fire({
                title: "Success!",
                text: "Leave Updated!",
                icon: "success"
              });
              this.isGoingToUpdate = false;
              this.updatingLeaveId= 0;
              this.loadLeaves();
            }
            else if(isErrorResponse(res)){
              Swal.fire({
                title: "Failed!",
                text: res.message,
                icon: "error"
              });
              this.isGoingToUpdate = false;
              this.updatingLeaveId= 0;
            }
            else{
              Swal.fire({
                title: "Failed!",
                text: "Unkown error occurred!",
                icon: "error"
              });
              this.isGoingToUpdate = false;
              this.updatingLeaveId= 0;
            }
          })
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Leave has not been updated.",
            icon: "error"
          });
        }
      });
      
    }
    this.leaveForm.controls.startDate.reset();
    this.leaveForm.controls.endDate.reset();
    this.leaveForm.controls.approved.reset();
  }

  onDelete(leave:any){

    if(leave){
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
      }).then((result)=>{
        if (result.isConfirmed) {
          this.leaveService.deleteLeave(leave.id).subscribe(res=>{
            if(isSuccessResponse(res)){
              Swal.fire({
                title: "Success!",
                text: "Leave Deleted!",
                icon: "success"
              });
              this.loadLeaves();
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
          })
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Leave has not been deleted.",
            icon: "error"
          });
        }
      });
    }
  }

  cancelUpdate(){
    this.isGoingToUpdate = false;
    this.updatingLeaveId= 0;
    this.leaveForm.controls.startDate.reset();
    this.leaveForm.controls.endDate.reset();
    this.leaveForm.controls.approved.reset();
  }


}
