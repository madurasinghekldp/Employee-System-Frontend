import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../types/employee';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private readonly http:HttpClient) { }

  private readonly apiUrl = environment.apiUrl;

  getAll(companyId:number|null|undefined,limit: number, offset: number, search: string):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse | ErrorResponse>(
      `${this.apiUrl}emp/all-selected?companyId=${companyId}&limit=${limit}&offset=${offset}&search=${search}`,
      {responseType:"json"}
    );
  }

  delete(employee:Employee):Observable<SuccessResponse|ErrorResponse>{
    return this.http.delete<SuccessResponse | ErrorResponse>(
      `${this.apiUrl}emp?id=${employee.id}`,
      {responseType:"json"}
    );
  }

  update(selectedEmployee:Employee):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse | ErrorResponse>(
      `${this.apiUrl}emp`,
      selectedEmployee,{responseType:"json"}
    );
  }

  add(employee:Employee):Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse | ErrorResponse>(
      `${this.apiUrl}emp`,
      employee,{responseType:"json"}
    );
  }

  getAllByCompany(companyId:number|null|undefined,departmentId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse|ErrorResponse>(`${this.apiUrl}emp/all?companyId=${companyId}&departmentId=${departmentId}`,
    {responseType:"json"});
  }

  getCount(companyId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse | ErrorResponse>(`${this.apiUrl}emp/count?companyId=${companyId}`,{responseType:"json"})
  }
}
