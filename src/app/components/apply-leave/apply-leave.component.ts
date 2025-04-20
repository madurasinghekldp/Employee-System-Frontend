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
import { SpinnerComponent } from '../spinner/spinner.component';
import { GetUsers} from '../../types/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,HttpClientModule,NgFor,CommonModule,SpinnerComponent],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.css',
  providers:[EmployeeService,LeaveService,UserService]
})
export class ApplyLeaveComponent implements OnInit{

  store = inject(userStore);
  
  user = computed(() => this.store.user());

  public employeeList:Employee[] = [];
  public leaveList:Leaves[] = [];
  public userList:GetUsers[] = [];
  public leavesMessage:string = "";
  private readonly limit:number = 5;
  public offset:number = 0;
  public isGoingToUpdate:boolean = false;
  public updatingLeaveId:number = 0;
  public leaveData:any
  loading:boolean = false;

  constructor(
    private readonly employeeService:EmployeeService, 
    private readonly leaveService:LeaveService,
    private readonly userService:UserService
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
    this.loadLeaveCategoryCount();
    this.loadUsers();
  }

  leave:LeaveCreate = {
    id: null,
    date: null,
    reason: null,
    user: null,
    leaveType: null,
    dayCount: null
  }

  leaveForm = new FormGroup({
    date: new FormControl('',Validators.required),
    leaveType: new FormControl('',Validators.required),
    check: new FormControl('',Validators.required),
    reason: new FormControl('',Validators.required),
    referenceTo: new FormControl<GetUsers|null>(null,Validators.required)
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
        date: this.leaveForm.controls.date.value,
        reason: this.leaveForm.controls.reason.value,
        leaveType: this.leaveForm.controls.leaveType.value,
        dayCount: this.leaveForm.controls.check.value === "half"? 0.5 : 1
      }
      this.loading = true;
      this.leaveService.createLeave(this.leave,this.leaveForm.controls.referenceTo.value?.id).subscribe(res=>{
        this.loading = false;
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
      this.leaveForm.controls.date.reset();
      this.leaveForm.controls.leaveType.reset();
      this.leaveForm.controls.check.reset();
      this.leaveForm.controls.reason.reset();
      this.leaveForm.controls.referenceTo.reset();
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
    if(this.user()){
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

  loadLeaveCategoryCount(){
    if(this.user()){
      this.leaveService.getLeaveCategoryCountByUser(this.user()?.id).subscribe(res=>{
        if(isSuccessResponse(res)){
          this.leaveData = res.data;
        }
        else if(isErrorResponse(res)){
          this.leaveData = null;
        }
        else{
          this.leaveData = null;
        }
      })
    }
  }

  loadUsers(){
    if(this.user()){
      this.userService.getCompanyUsers(this.user()?.company?.id).subscribe(res=>{
        if(isSuccessResponse(res)){
          this.userList = res.data;
        }
        else if(isErrorResponse(res)){
          this.userList = [];
        }
        else{
          this.userList = [];
        }
      })
    }
  }

}
