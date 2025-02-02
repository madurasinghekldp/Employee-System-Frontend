import { Component, inject,OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Leaves } from '../../types/leaves';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeService } from '../../services/employee.service';
import { LeaveService } from '../../services/leave.service';
import { Employee } from '../../types/employee';
import { userStore } from '../../store/user.store';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,HttpClientModule,NgFor],
  templateUrl: './leaves.component.html',
  styleUrl: './leaves.component.css',
  providers:[EmployeeService,LeaveService]
})
export class LeavesComponent implements OnInit{

  store = inject(userStore);
  
  get user() {
    return this.store.user();
  }

  public employeeList:Employee[] = [];
  public leaveList:Leaves[] = [];
  public leavesMessage:string = "";

  constructor(
    private readonly employeeService:EmployeeService, 
    private readonly leaveService:LeaveService
  ){}

  ngOnInit(): void {
    this.init();
  }

  init(){
    setTimeout(()=>{
      if(this.store.user()){
        this.employeeService.getAllByCompany(this.user?.company.id).subscribe(res=>{
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
    },500);
    
  }

  leave:Leaves = {
    id:null,
    employee: null,
    startDate: "",
    endDate: ""
  }

  leaveForm = new FormGroup({
    employee: new FormControl(null,Validators.required),
    startDate: new FormControl('',Validators.required),
    endDate: new FormControl('',Validators.required)
  });

  submitLeave(){
    this.leave = {
      id:null,
      employee: this.leaveForm.controls.employee.value,
      startDate: this.leaveForm.controls.startDate.value,
      endDate: this.leaveForm.controls.endDate.value
    }
    this.leaveService.createLeave(this.leave).subscribe(res=>{
      if(isSuccessResponse(res)){
        console.log(res);
      }
      else if(isErrorResponse(res)){
        console.log(res);
      }
      else{}
    })
  }

  employeeSelected(){
    if(this.leaveForm.controls.employee.valid && this.leaveForm.controls.employee.value!=null){
      const employeeSelected:Employee = this.leaveForm?.controls?.employee?.value;
      this.leaveService.getAllLeaves(employeeSelected.id).subscribe(res=>{
        if(isSuccessResponse(res)){
          this.leaveList = res.data;
        }
        else if(isErrorResponse(res)){
          this.leaveList = [];
          this.leavesMessage = "Leaves not found";
        }
        else{
          this.leaveList = [];
          this.leavesMessage = "Leaves not found";
        }
      })
    }
  }

}
