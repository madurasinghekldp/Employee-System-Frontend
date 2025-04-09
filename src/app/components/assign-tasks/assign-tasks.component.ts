import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { userStore } from '../../store/user.store';
import { Employee } from '../../types/employee';
import { TaskService } from '../../services/task.service';
import { EmployeeService } from '../../services/employee.service';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../types/task';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgFor } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-assign-tasks',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,HttpClientModule,NgFor,CommonModule,SpinnerComponent],
  templateUrl: './assign-tasks.component.html',
  styleUrl: './assign-tasks.component.css',
  providers:[TaskService,EmployeeService]
})
export class AssignTasksComponent implements OnInit {
  store = inject(userStore);
    
  user = computed(() => this.store.user());

  public employeeList:Employee[] = [];
  public taskList: Task[] = [];
  public tasksMessage: string = "";
  public isGoingToUpdate: boolean = false;
  public updatingTaskId: number|null = 0;
  private readonly limit:number = 5;
  public offset:number = 0;
  loading:boolean = false;

  constructor(
    private readonly taskService: TaskService,
    private readonly employeeService:EmployeeService
  ) {
    effect(()=>{
      this.init();
    })
  }

  ngOnInit(): void {
    this.init();
  }

  init(){
    
    this.loadTasks();
    
  }

  task:Task = {
    id: null,
    employee: null,
    taskName: null,
    startDate: null,
    dueDate: null,
    completedDate: null,
    overDues: null,
    status: null,
    approvedBy: null
  }


  taskForm = new FormGroup({
    
    taskName: new FormControl({value:'', disabled:true}, Validators.required),
    status: new FormControl('',Validators.required),
    startDate: new FormControl({value:'', disabled:true}, Validators.required),
    dueDate: new FormControl({value:'', disabled:true}, Validators.required),
    completedDate: new FormControl({value:'', disabled:true})
  });

  

  goToPreviousPage(){
    if(this.offset>0){
      this.offset -= 5;
      this.loadTasks();
    }
  }

  goToNextPage(){
    this.offset +=5 ;
    this.loadTasks();
  }

  loadTasks() {
    
    this.taskService.getAllTasksByUser(this.limit,this.offset,this.user()?.id).subscribe(res => {
      if(isSuccessResponse(res)){
        this.taskList = res.data;
        this.tasksMessage = "";
      }
      else if(isErrorResponse(res)){
        this.taskList = [];
        this.tasksMessage = "Tasks not found";
      }
      else{
        this.taskList = [];
        this.tasksMessage = "Unexpected error occurred";
      }
    });
    
    
  }

  onEdit(task: Task) {
    this.isGoingToUpdate = true;
    this.updatingTaskId = task.id;
    this.taskForm.patchValue({
      taskName: task.taskName,
      startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      completedDate: task.completedDate ? new Date(task.completedDate).toISOString().split('T')[0] : '',
      status: task.status
    });
  }

  onCancel(){
    this.isGoingToUpdate = false;
    this.updatingTaskId = 0;
    this.taskForm.controls.taskName.reset();
    this.taskForm.controls.startDate.reset();
    this.taskForm.controls.dueDate.reset();
    this.taskForm.controls.completedDate.reset();
    this.taskForm.controls.status.reset();
  }

  updateTask() {
    if (this.taskForm.valid) {
      const updatedTask: Task = {
        id: this.updatingTaskId,
        employee: null,
        taskName: this.taskForm.controls.taskName.value,
        startDate: this.taskForm.controls.startDate.value,
        dueDate: this.taskForm.controls.dueDate.value,
        completedDate: this.taskForm.controls.completedDate.value,
        overDues: null,
        status: this.taskForm.controls.status.value,
        approvedBy:  {
          id:this.user()?.id, 
          firstName:null, 
          lastName:null, 
          email:null, 
          password:null, 
          userRoleName:null, 
          company:null}
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
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then((result)=>{
        if(result.isConfirmed){
          this.loading = true;
          this.taskService.updateTaskByUser(updatedTask).subscribe(res => {
            this.loading = false;
            if(isSuccessResponse(res)){
              Swal.fire("Success!", "Task Updated!", "success");
              this.isGoingToUpdate = false;
              this.updatingTaskId = 0;
              this.loadTasks();
            }
            else if(isErrorResponse(res)){
              Swal.fire({
                title: "Failed!",
                text: res.message,
                icon: "error"
              });
              this.isGoingToUpdate = false;
              this.updatingTaskId= 0;
            }
            else{
              Swal.fire({
                title: "Failed!",
                text: "Unkown error occurred!",
                icon: "error"
              });
              this.isGoingToUpdate = false;
              this.updatingTaskId= 0;
            }
          });
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Task has not been updated.",
            icon: "error"
          });
        }
      });
      this.taskForm.controls.taskName.reset();
      this.taskForm.controls.startDate.reset();
      this.taskForm.controls.dueDate.reset();
      this.taskForm.controls.completedDate.reset();
      this.taskForm.controls.status.reset();
    }
    
  }

  onDelete(task: Task) {
    if(task){
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
          this.taskService.deleteTask(task.id).subscribe(res => {
            if(isSuccessResponse(res)){
              Swal.fire({
                title: "Success!",
                text: "Task Deleted!",
                icon: "success"
              });
              this.loadTasks();
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
            text: "Task has not been deleted.",
            icon: "error"
          });
        }
      });
    }
    
  }


}
