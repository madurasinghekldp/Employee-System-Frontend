import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { Observable } from 'rxjs';
import { Department } from '../types/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http:HttpClient) { }

  getAll():Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse | ErrorResponse>(
      "http://localhost:8080/dep/all",
      {responseType:"json"}
    );
  }

  getAllSelected(limit: number, offset: number):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse | ErrorResponse>(
      `http://localhost:8080/dep/all-selected?limit=${limit}&offset=${offset}`,
      {responseType:"json"}
    );
  }

  add(department:Department):Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse|ErrorResponse>(
      "http://localhost:8080/dep",
      department,{responseType:"json"}
    );
  }

  update(department:Department):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse | ErrorResponse>(
      "http://localhost:8080/dep",
      department,{responseType:"json"}
    );
  }

  delete(department:Department):Observable<SuccessResponse|ErrorResponse>{
    return this.http.delete<SuccessResponse | ErrorResponse>(
      `http://localhost:8080/dep?id=${department.id}`,
      {responseType:"json"}
    );
  }
}