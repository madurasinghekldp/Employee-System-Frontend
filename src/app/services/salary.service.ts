import { Injectable } from '@angular/core';
import { Salary } from '../types/salary';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  constructor(private readonly http:HttpClient) { }

  deleteSalary(id: any) :Observable<SuccessResponse|ErrorResponse>{
    return this.http.delete<SuccessResponse|ErrorResponse>(`http://localhost:8080/salary?id=${id}`,{responseType:"json"});
  }
  updateSalary(salary: Salary) :Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse|ErrorResponse>("http://localhost:8080/salary",salary,{responseType:"json"});
  }
  getAllSalaries(limit: number, offset: number, employeeId: number | null) :Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`http://localhost:8080/salary/all?employeeId=${employeeId}&limit=${limit}&offset=${offset}`,{responseType:"json"});
  }
  createSalary(salary: Salary):Observable<SuccessResponse|ErrorResponse> {
    return this.http.post<SuccessResponse|ErrorResponse>(`http://localhost:8080/salary`,salary,{responseType:"json"})
  }
 
}
