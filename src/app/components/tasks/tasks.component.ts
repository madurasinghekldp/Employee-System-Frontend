import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../types/task';
import Swal from 'sweetalert2';
import { Employee } from '../../types/employee';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { userStore } from '../../store/user.store';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  providers:[TaskService,EmployeeService]
})
export class TasksComponent  implements OnInit {

  store = inject(userStore);
    
  get user() {
    return this.store.user();
  }

  public employeeList:Employee[] = [];
  public taskList: Task[] = [];
  public tasksMessage: string = "";
  public isGoingToUpdate: boolean = false;
  public updatingTaskId: number|null = 0;
  private readonly limit:number = 5;
  public offset:number = 0;

  constructor(
    private readonly taskService: TaskService,
    private readonly employeeService:EmployeeService
  ) {}

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

  task:Task = {
    id: null,
    employee: null,
    taskName: null,
    startDate: null,
    dueDate: null,
    completedDate: null,
    overDues: null
  }

  taskForm = new FormGroup({
    employee: new FormControl<Employee | null>(null,Validators.required),
    taskName: new FormControl('', Validators.required),
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
        overDues: null
      }
      this.taskService.createTask(newTask).subscribe(res => {
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
    }
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
          this.tasksMessage = "Leaves not found";
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
    });
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
        overDues: null
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
          this.taskService.updateTask(updatedTask).subscribe(res => {
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
    }
  }

  onDelete(task: Task) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete it!",
      cancelButtonText: "No, cancel!"
    }).then(result => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(task.id).subscribe(res => {
          Swal.fire("Success!", "Task Deleted!", "success");
          this.loadTasks();
        });
      }
    });
  }

}
