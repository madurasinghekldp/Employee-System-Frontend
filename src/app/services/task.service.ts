import { Injectable } from '@angular/core';
import { Task } from '../types/task';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private readonly http:HttpClient) { }

  deleteTask(id: number | null) {
    throw new Error('Method not implemented.');
  }
  updateTask(updatedTask: Task):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse|ErrorResponse>()
  }
  getAllTasks(limit: number, offset: number, employeeId:number|null) :Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`http://localhost:8080/task/all?employeeId=${employeeId}&limit=${limit}
    &offset=${offset}`,{responseType:"json"});
  }
  createTask(newTask: Task) :Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse|ErrorResponse>("http://localhost:8080/task",newTask,{responseType:"json"})
  }

}
