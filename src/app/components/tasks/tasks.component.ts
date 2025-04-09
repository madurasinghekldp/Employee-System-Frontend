import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../types/task';
import Swal from 'sweetalert2';
import { Employee } from '../../types/employee';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { userStore } from '../../store/user.store';
import { EmployeeService } from '../../services/employee.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgFor } from '@angular/common';
import { User } from '../../types/user';
import { Department } from '../../types/department';
import { DepartmentService } from '../../services/department.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,HttpClientModule,NgFor,CommonModule,SpinnerComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  providers:[TaskService,EmployeeService,DepartmentService]
})
export class TasksComponent  implements OnInit {

  store = inject(userStore);
    
  user = computed(() => this.store.user());

  public employeeList:Employee[] = [];
  public taskList: Task[] = [];
  public departmentList:Department[] = [];
  public tasksMessage: string = "";
  public isGoingToUpdate: boolean = false;
  public updatingTaskId: number|null = 0;
  private readonly limit:number = 5;
  public offset:number = 0;
  loading:boolean = false;

  constructor(
    private readonly taskService: TaskService,
    private readonly employeeService:EmployeeService,
    private readonly departmentService:DepartmentService
  ) {
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
    department: new FormControl<Department | null>(null,Validators.required),
    employee: new FormControl<Employee | null>(null,Validators.required),
    taskName: new FormControl('', Validators.required),
    status: new FormControl('',Validators.required),
    startDate: new FormControl('', Validators.required),
    dueDate: new FormControl('', Validators.required),
    completedDate: new FormControl('')
  });

  submitTask() {
    if (this.taskForm.valid) {
      const newTask: Task = {
        id: null,
        employee: this.taskForm.controls.employee.value,
        taskName: this.taskForm.controls.taskName.value,
        startDate: this.taskForm.controls.startDate.value,
        dueDate: this.taskForm.controls.dueDate.value,
        completedDate: this.taskForm.controls.completedDate.value,
        overDues: null,
        status: this.taskForm.controls.status.value,
        approvedBy: null
      }
      this.loading = true;
      this.taskService.createTask(newTask).subscribe(res => {
        this.loading = false;
        if(isSuccessResponse(res)){
          Swal.fire("Success!", "Task Added!", "success");
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
        this.loadTasks();
      });
      this.taskForm.controls.taskName.reset();
      this.taskForm.controls.startDate.reset();
      this.taskForm.controls.dueDate.reset();
      this.taskForm.controls.completedDate.reset();
      this.taskForm.controls.status.reset();
    }
    else{
      this.taskForm.controls.employee.markAsTouched();
    }
  }

  employeeSelected(){
    this.loadTasks();
  }

  departmentSelected(){
    if(this.store.user()){
      this.employeeService.getAllByCompany(this.user()?.company.id,this.taskForm.controls.department.value?.id).subscribe(res=>{
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
    if(this.taskForm.controls.employee.valid && this.taskForm.controls.employee.value!=null){
      const employeeSelected:Employee = this.taskForm?.controls?.employee?.value;
      this.taskService.getAllTasks(this.limit,this.offset,employeeSelected.id).subscribe(res => {
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
        employee: this.taskForm.controls.employee.value,
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
          this.taskService.updateTask(updatedTask).subscribe(res => {
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
    else{
      this.taskForm.controls.employee.markAsTouched();
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
          this.loading = true;
          this.taskService.deleteTask(task.id).subscribe(res => {
            this.loading = false;
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
