import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUser } from '../types/createUser';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { LoginUser } from '../types/loginUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  signup(createUser:CreateUser):Observable<SuccessResponse|ErrorResponse>{
    console.log(createUser);
    const res = this.http.post<SuccessResponse | ErrorResponse>("http://localhost:8080/auth/signup",createUser,{responseType:"json"});
    console.log(res);
    return res;
  }

  login(loginUser:LoginUser):Observable<SuccessResponse|ErrorResponse|any>{
    const res =this.http.post<SuccessResponse | ErrorResponse>("http://localhost:8080/auth/login",loginUser,{responseType:"json"});
    console.log(res);
    return res;
  }
}
