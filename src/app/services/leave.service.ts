import { Injectable } from '@angular/core';
import { Leaves } from '../types/leaves';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { Employee } from '../types/employee';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  constructor(private http:HttpClient) { }

  createLeave(leave: Leaves):Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse|ErrorResponse>(`http://localhost:8080/leave`,leave,{responseType:"json"});
  }

  getAllLeaves(employeeId:number|null):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`http://localhost:8080/leave?employeeId=${employeeId}`,
    {responseType:"json"});
  }
}
