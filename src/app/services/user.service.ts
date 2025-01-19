import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUser } from '../types/createUser';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  signup(createUser:CreateUser):Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse | ErrorResponse>("http://localhost:8080/auth/signup",createUser,{responseType:"json"});
  }
}
