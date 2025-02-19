import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateUser } from '../types/createUser';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { LoginUser } from '../types/loginUser';
import { TokenService } from './token.service';
import { userStore } from '../store/user.store';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  store = inject(userStore);

  constructor(
    private readonly http:HttpClient,
    private readonly tokenService:TokenService
  ) { }

  signup(createUser:CreateUser):Observable<SuccessResponse|ErrorResponse>{
    console.log(createUser);
    const res = this.http.post<SuccessResponse | ErrorResponse>("http://localhost:8080/auth/signup",createUser,
    {responseType:"json"});
    return res;
  }

  login(loginUser:LoginUser):Observable<SuccessResponse|ErrorResponse>{
    const res =this.http.post<SuccessResponse | ErrorResponse>("http://localhost:8080/auth/login",loginUser,
    {responseType:"json"});
    return res;
  }

  getUserDetailsByEmail():Observable<SuccessResponse|ErrorResponse>{
    const email = this.tokenService.getUserEmail();
    const res = this.http.get<SuccessResponse | ErrorResponse>("http://localhost:8080/users/by-email?email="+email,
    {responseType:"json"});
    return res;
  }

  createUser(createUser:CreateUser):Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse | ErrorResponse>("http://localhost:8080/users",createUser,{responseType:"json"});
  }

  updateUser(id:number|null|undefined,user:any):Observable<SuccessResponse|ErrorResponse>{
    return this.http.patch<SuccessResponse|ErrorResponse>(`http://localhost:8080/users?id=${id}`,user,{responseType:"json"});
  }

  deleteUser(id:number|null|undefined){
    return this.http.delete<SuccessResponse|ErrorResponse>(`http://localhost:8080/users?id=${id}`,{responseType:"json"});
  }
}
