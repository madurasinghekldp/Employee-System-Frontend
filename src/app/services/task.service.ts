import { Injectable } from '@angular/core';
import { Task } from '../types/task';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private readonly http:HttpClient) { }

  private readonly apiUrl = environment.apiUrl;

  deleteTask(id:number|null):Observable<SuccessResponse|ErrorResponse>{
    return this.http.delete<SuccessResponse|ErrorResponse>(`${this.apiUrl}task?id=${id}`,{responseType:"json"});
  }
  updateTask(updatedTask: Task):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse|ErrorResponse>(`${this.apiUrl}task`,updatedTask,{responseType:"json"});
  }
  updateTaskByUser(updatedTask: Task):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse|ErrorResponse>(`${this.apiUrl}task/by-user`,updatedTask,{responseType:"json"});
  }
  getAllTasks(limit: number, offset: number, employeeId:number|null) :Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}task/all?employeeId=${employeeId}&limit=${limit}
    &offset=${offset}`,{responseType:"json"});
  }

  getAllTasksByUser(limit: number, offset: number, userId:number|null|undefined) :Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}task/all-by-user?userId=${userId}&limit=${limit}
    &offset=${offset}`,{responseType:"json"});
  }
  createTask(newTask: Task,userId:number|null|undefined) :Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse|ErrorResponse>(`${this.apiUrl}task?userId=${userId}`,newTask,{responseType:"json"})
  }

  getTasksByStatus(companyId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}task/get-by-status?companyId=${companyId}`,
      {responseType:"json"})
  }

  getTaskCountByUser(userId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}task/count?userId=${userId}`,
      {responseType:"json"})
  }

  getTasksByStatusByUser(userId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}task/get-by-status-user?userId=${userId}`,
      {responseType:"json"})
  }

  getEmployeeMonthlyRejectedTasks(employeeId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}task/employee-monthly-rejected-tasks?employeeId=${employeeId}`,
      {responseType:"json"})
  }

  getEmployeeMonthlyLateTasks(employeeId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}task/employee-monthly-late-tasks?employeeId=${employeeId}`,
      {responseType:"json"})
  }

}
