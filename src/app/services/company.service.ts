import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private readonly http: HttpClient) { }

  private readonly apiUrl = environment.apiUrl;

  updateCompany(company:any):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse|ErrorResponse>(`${this.apiUrl}company`, company,{responseType:"json"});
  }
}
