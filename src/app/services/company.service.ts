import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { Company } from '../types/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private readonly http: HttpClient) { }

  updateCompany(company:any):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse|ErrorResponse>("http://localhost:8080/company", company,{responseType:"json"});
  }
}
