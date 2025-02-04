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

  constructor(private readonly http:HttpClient) { }

  createLeave(leave: Leaves):Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse|ErrorResponse>(`http://localhost:8080/leave`,leave,{responseType:"json"});
  }

  getAllLeaves(limit:number,offset:number,employeeId:number|null):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`http://localhost:8080/leave/all?employeeId=${employeeId}&limit=${limit}
    &offset=${offset}`,{responseType:"json"});
  }

  updateLeave(leave: Leaves):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse|ErrorResponse>("http://localhost:8080/leave",leave,{responseType:"json"});
  }

  deleteLeave(id: number | null):Observable<SuccessResponse|ErrorResponse> {
    return this.http.delete<SuccessResponse|ErrorResponse>(`http://localhost:8080/leave?id=${id}`,{responseType:"json"});
  }
}
