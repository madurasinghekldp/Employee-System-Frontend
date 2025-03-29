import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { Observable } from 'rxjs';
import { Department } from '../types/department';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private readonly http:HttpClient) { }

  private readonly apiUrl = environment.apiUrl;

  getAll(companyId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse | ErrorResponse>(
      `${this.apiUrl}dep/all?companyId=${companyId}`,
      {responseType:"json"}
    );
  }

  getAllSelected(companyId:number|null|undefined,limit: number, offset: number, search:string):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse | ErrorResponse>(
      `${this.apiUrl}dep/all-selected?companyId=${companyId}&limit=${limit}&offset=${offset}&search=${search}`,
      {responseType:"json"}
    );
  }

  add(department:Department):Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse|ErrorResponse>(
      `${this.apiUrl}dep`,
      department,{responseType:"json"}
    );
  }

  update(department:Department):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse | ErrorResponse>(
      `${this.apiUrl}dep`,
      department,{responseType:"json"}
    );
  }

  delete(department:Department):Observable<SuccessResponse|ErrorResponse>{
    return this.http.delete<SuccessResponse | ErrorResponse>(
      `${this.apiUrl}dep?id=${department.id}`,
      {responseType:"json"}
    );
  }

  getCount(companyId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse | ErrorResponse>(`${this.apiUrl}dep/count?companyId=${companyId}`,{responseType:"json"})
  }
}
