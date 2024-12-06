import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { Observable } from 'rxjs';
import { Role } from '../types/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http:HttpClient) { }

  getAll():Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse | ErrorResponse>(
      "http://localhost:8080/role/all",
      {responseType:"json"});
  }

  getAllSelected(limit: number, offset: number, search:string):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse | ErrorResponse>(
      `http://localhost:8080/role/all-selected?limit=${limit}&offset=${offset}&search=${search}`,
      {responseType:"json"}
    );
  }

  add(role: Role):Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse | ErrorResponse>(
      "http://localhost:8080/role",
      role,{responseType:"json"}
    );
  }

  update(role: Role):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse | ErrorResponse>(
      "http://localhost:8080/role",
      role,{responseType:"json"}
    );
  }

  delete(role: Role):Observable<SuccessResponse|ErrorResponse>{
    return this.http.delete<SuccessResponse | ErrorResponse>(
      `http://localhost:8080/role?id=${role.id}`,
      {responseType:"json"}
    );
  }
}
