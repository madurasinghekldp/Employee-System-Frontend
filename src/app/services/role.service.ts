import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { Observable } from 'rxjs';
import { Role } from '../types/role';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private readonly http:HttpClient) { }

  private readonly apiUrl = environment.apiUrl;

  getAll(companyId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse | ErrorResponse>(
      `${this.apiUrl}role/all?companyId=${companyId}`,
      {responseType:"json"});
  }

  getAllSelected(companyId:number|null|undefined,limit: number, offset: number, search:string):Observable<SuccessResponse|ErrorResponse>{
    return this.http.get<SuccessResponse | ErrorResponse>(
      `${this.apiUrl}role/all-selected?companyId=${companyId}&limit=${limit}&offset=${offset}&search=${search}`,
      {responseType:"json"}
    );
  }

  add(role: Role):Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse | ErrorResponse>(
      `${this.apiUrl}role`,
      role,{responseType:"json"}
    );
  }

  update(role: Role):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse | ErrorResponse>(
      `${this.apiUrl}role`,
      role,{responseType:"json"}
    );
  }

  delete(role: Role):Observable<SuccessResponse|ErrorResponse>{
    return this.http.delete<SuccessResponse | ErrorResponse>(
      `${this.apiUrl}role?id=${role.id}`,
      {responseType:"json"}
    );
  }
}
