import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatChipsModule} from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { LeaveService } from '../../services/leave.service';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { TaskService } from '../../services/task.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PerformanceService } from '../../services/performance.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [MatSlideToggleModule,MatChipsModule,HttpClientModule,FormsModule,MatProgressBarModule,CommonModule],
  templateUrl: './performance.component.html',
  styleUrl: './performance.component.css',
  providers: [LeaveService, TaskService, PerformanceService]
})
export class PerformanceComponent implements OnInit{

  employeeId:number|null = null;
  leaveCountChecked:boolean = false;
  rejectedTaskCountChecked:boolean = false;
  lateSubmittedTaskCountChecked:boolean = false;
  leaveCount:number = 0;
  rejectedTaskCount:number = 0;
  lateSubmittedTaskCount:number = 0;
  performanceValue:number = 0;
  loading:boolean = false;

  constructor(
    private readonly router: ActivatedRoute,
    private readonly leaveService: LeaveService,
    private readonly taskService: TaskService,
    private readonly performanceService: PerformanceService
  ) {
    
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params=>{
      this.employeeId = params['employeeId'] ? +params['employeeId'] : null;
      console.log(this.employeeId);
    })
  }

  getLeaveCount(){
    console.log(this.leaveCountChecked);
    if(this.leaveCountChecked){
      this.leaveService.getEmployeeMonthlyLeaveCount(this.employeeId).subscribe(res=>{
        if(isSuccessResponse(res)){
          this.leaveCount = res.data.leave_count;
        }
        else if(isErrorResponse(res)){
          this.leaveCount = 0;
        }
      });
    }
  }

  getRejectedTaskCount(){
    if(this.rejectedTaskCountChecked){
      this.taskService.getEmployeeMonthlyRejectedTasks(this.employeeId).subscribe(res=>{
        if(isSuccessResponse(res)){
          this.rejectedTaskCount = res.data.rejected_count;
        }
        else if(isErrorResponse(res)){
          this.rejectedTaskCount = 0;
        }
      });
    }
  }

  getLateSubmittedTaskCount(){
    if(this.lateSubmittedTaskCountChecked){
      this.taskService.getEmployeeMonthlyLateTasks(this.employeeId).subscribe(res=>{
        if(isSuccessResponse(res)){
          this.lateSubmittedTaskCount = res.data.late_count;
        }
        else if(isErrorResponse(res)){
          this.lateSubmittedTaskCount = 0;
        }
      });
    }
  }

  getEmployeePerformanceValue(){
    if(this.leaveCountChecked && this.rejectedTaskCountChecked && this.lateSubmittedTaskCountChecked){
      this.loading = true;
      this.performanceService.getEmployeePerformanceValue(this.leaveCount,this.rejectedTaskCount,this.lateSubmittedTaskCount).subscribe({
        
        next: res=>{
          this.loading = false;
          this.performanceValue = res.performance*10;
        },
        error: err=>{
          this.loading = false;
          this.performanceValue = 0;
        }
      });
    }
  }

}
