import { Injectable } from '@angular/core';
import { Leaves } from '../types/leaves';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { LeaveCreate } from '../types/apply-leave';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  constructor(private readonly http:HttpClient) { }

  private readonly apiUrl = environment.apiUrl;

  createLeave(leave: LeaveCreate):Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse|ErrorResponse>(`${this.apiUrl}leave`,leave,{responseType:"json"});
  }

  getAllLeaves(limit:number,offset:number,employeeId:number|null):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}leave/all?employeeId=${employeeId}&limit=${limit}&offset=${offset}`,{responseType:"json"});
  }

  getAllLeavesByUser(limit:number,offset:number,userId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}leave/all-by-user?userId=${userId}&limit=${limit}&offset=${offset}`,{responseType:"json"});
  }

  updateLeave(leave: Leaves):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse|ErrorResponse>(`${this.apiUrl}leave`,leave,{responseType:"json"});
  }

  deleteLeave(id: number | null):Observable<SuccessResponse|ErrorResponse> {
    return this.http.delete<SuccessResponse|ErrorResponse>(`${this.apiUrl}leave?id=${id}`,{responseType:"json"});
  }

  getLeaveCountsDatesByCompany(companyId:number|null|undefined):Observable<SuccessResponse|ErrorResponse> {
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}leave/company-leaves?companyId=${companyId}`,{responseType:"json"});
  }

  getLeaveCountByUser(userId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}leave/count?userId=${userId}`,{responseType:"json"})
  }

  getLeaveCountsDatesByUser(userId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}leave/user-leaves?userId=${userId}`,{responseType:"json"})
  }

  getLeaveCategoryCountByUser(userId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}leave/user-leave-category-count?userId=${userId}`,
      {responseType:"json"})
  }

  getEmployeeMonthlyLeaveCount(employeeId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}leave/employee-monthly-leave-count?employeeId=${employeeId}`,
      {responseType:"json"})
  }
}
