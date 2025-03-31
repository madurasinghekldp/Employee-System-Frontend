import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private readonly http: HttpClient) { }

  private readonly apiUrl = environment.apiUrl;

  updateCompany(company:any):Observable<SuccessResponse|ErrorResponse>{
    return this.http.put<SuccessResponse|ErrorResponse>(`${this.apiUrl}company`, company,{responseType:"json"});
  }

  uploadCompanyImage(file:File|null,companyId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    const formData = new FormData();
    if(file && companyId){
      
      formData.append('file', file);
      formData.append('companyId', companyId.toString());
      
    }
    return this.http.post<SuccessResponse|ErrorResponse>(`${this.apiUrl}images/logo/upload`,formData,{responseType:"json"})
  }
}
