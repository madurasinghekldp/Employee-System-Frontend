import { Injectable } from '@angular/core';
import { Salary } from '../types/salary';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  constructor(private readonly http:HttpClient) { }

  private readonly apiUrl = environment.apiUrl;

  deleteSalary(id: any) :Observable<SuccessResponse|ErrorResponse>{
    return this.http.delete<SuccessResponse|ErrorResponse>(`${this.apiUrl}salary?id=${id}`,{responseType:"json"});
  }
  updateSalary(salary: Salary) :Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse|ErrorResponse>(`${this.apiUrl}salary`,salary,{responseType:"json"});
  }
  getAllSalaries(limit: number, offset: number, employeeId: number | null) :Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}salary/all?employeeId=${employeeId}&limit=${limit}&offset=${offset}`,{responseType:"json"});
  }
  createSalary(salary: Salary):Observable<SuccessResponse|ErrorResponse> {
    return this.http.post<SuccessResponse|ErrorResponse>(`${this.apiUrl}salary`,salary,{responseType:"json"})
  }
 
}
