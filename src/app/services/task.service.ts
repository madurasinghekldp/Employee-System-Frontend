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

  deleteTask(id:number|null):Observable<SuccessResponse|ErrorResponse>{
    return this.http.delete<SuccessResponse|ErrorResponse>(`http://localhost:8080/task?id=${id}`,{responseType:"json"});
  }
  updateTask(updatedTask: Task):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse|ErrorResponse>("http://localhost:8080/task",updatedTask,{responseType:"json"});
  }
  updateTaskByUser(updatedTask: Task):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse|ErrorResponse>("http://localhost:8080/task/by-user",updatedTask,{responseType:"json"});
  }
  getAllTasks(limit: number, offset: number, employeeId:number|null) :Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`http://localhost:8080/task/all?employeeId=${employeeId}&limit=${limit}
    &offset=${offset}`,{responseType:"json"});
  }

  getAllTasksByUser(limit: number, offset: number, userId:number|null|undefined) :Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`http://localhost:8080/task/all-by-user?userId=${userId}&limit=${limit}
    &offset=${offset}`,{responseType:"json"});
  }
  createTask(newTask: Task) :Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse|ErrorResponse>("http://localhost:8080/task",newTask,{responseType:"json"})
  }

  getTasksByStatus(companyId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`http://localhost:8080/task/get-by-status?companyId=${companyId}`,{responseType:"json"})
  }

  getTaskCountByUser(userId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`http://localhost:8080/task/count?userId=${userId}`,{responseType:"json"})
  }

  getTasksByStatusByUser(userId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`http://localhost:8080/task/get-by-status-user?userId=${userId}`,{responseType:"json"})
  }

}
