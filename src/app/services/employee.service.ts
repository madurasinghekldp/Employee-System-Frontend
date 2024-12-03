import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../types/employee';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }


  getAll(limit: number, offset: number):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse | ErrorResponse>(
      `http://localhost:8080/emp/all-selected?limit=${limit}&offset=${offset}`,
      {responseType:"json"}
    );
  }

  delete(employee:Employee):Observable<SuccessResponse|ErrorResponse>{
    return this.http.delete<SuccessResponse | ErrorResponse>(
      `http://localhost:8080/emp?id=${employee.id}`,
      {responseType:"json"}
    );
  }

  update(selectedEmployee:Employee):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse | ErrorResponse>(
      "http://localhost:8080/emp",
      selectedEmployee,{responseType:"json"}
    );
  }

  add(employee:Employee):Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse | ErrorResponse>(
      "http://localhost:8080/emp",
      employee,{responseType:"json"}
    );
  }
}
