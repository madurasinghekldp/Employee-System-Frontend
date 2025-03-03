import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { userStore } from '../../store/user.store';
import { Employee } from '../../types/employee';
import { Leaves } from '../../types/leaves';
import { EmployeeService } from '../../services/employee.service';
import { LeaveService } from '../../services/leave.service';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgFor } from '@angular/common';
import { LeaveCreate } from '../../types/apply-leave';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,HttpClientModule,NgFor,CommonModule],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.css',
  providers:[EmployeeService,LeaveService]
})
export class ApplyLeaveComponent implements OnInit{

  store = inject(userStore);
  
  user = computed(() => this.store.user());

  public employeeList:Employee[] = [];
  public leaveList:Leaves[] = [];
  public leavesMessage:string = "";
  private readonly limit:number = 5;
  public offset:number = 0;
  public isGoingToUpdate:boolean = false;
  public updatingLeaveId:number = 0;

  constructor(
    private readonly employeeService:EmployeeService, 
    private readonly leaveService:LeaveService
  ){
    effect(()=>{
      this.init();
    })
  }

  ngOnInit(): void {
    this.init();
  }

  init(){
    this.loadLeaves();
  }

  leave:LeaveCreate = {
    id: null,
    startDate: "",
    endDate: "",
    user: null
  }

  leaveForm = new FormGroup({
    startDate: new FormControl('',Validators.required),
    endDate: new FormControl('',Validators.required)
  });

  submitLeave(){
    if(this.leaveForm.valid){
      this.leave = {
        id:null,
        user: {
          id: this.user()?.id,
          firstName: null,
          lastName: null,
          email: null,
          password: null,
          userRoleName: null,
          company: null
        },
        startDate: this.leaveForm.controls.startDate.value,
        endDate: this.leaveForm.controls.endDate.value
      }
      this.leaveService.createLeave(this.leave).subscribe(res=>{
        if(isSuccessResponse(res)){
          Swal.fire({
            title: "Success!",
            text: "Leave Added!",
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
      });
      this.leaveForm.controls.startDate.reset();
      this.leaveForm.controls.endDate.reset();
    }
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
    this.leaveService.getAllLeavesByUser(this.limit,this.offset,this.user()?.id).subscribe(res=>{
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
