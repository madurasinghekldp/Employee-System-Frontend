import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CalResponse } from '../types/cal-response';

@Injectable({
  providedIn: 'root'
})


export class PerformanceService {

  constructor(private readonly http: HttpClient) { }
  
  private readonly calUrl = environment.calUrl;


  getEmployeePerformanceValue(leave_count:number,rejected_tasks:number,late_tasks:number):Observable<CalResponse>{
    return this.http.get<CalResponse>(`${this.calUrl}calc?leave_count=${leave_count}&rejected_tasks=${rejected_tasks}&late_tasks=${late_tasks}`,
      {responseType:"json"});
  }
}
