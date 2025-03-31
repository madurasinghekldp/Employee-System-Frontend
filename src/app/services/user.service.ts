import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateUser } from '../types/createUser';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../types/success-response';
import { ErrorResponse } from '../types/error-response';
import { LoginUser } from '../types/loginUser';
import { TokenService } from './token.service';
import { userStore } from '../store/user.store';
import { UpdatePassword } from '../types/update-password';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  store = inject(userStore);

  constructor(
    private readonly http:HttpClient,
    private readonly tokenService:TokenService
  ) { }

  private readonly apiUrl = environment.apiUrl;

  signup(createUser:CreateUser):Observable<SuccessResponse|ErrorResponse>{
    console.log(createUser);
    const res = this.http.post<SuccessResponse | ErrorResponse>(`${this.apiUrl}auth/signup`,createUser,
    {responseType:"json"});
    return res;
  }

  login(loginUser:LoginUser):Observable<SuccessResponse|ErrorResponse>{
    const res =this.http.post<SuccessResponse | ErrorResponse>(`${this.apiUrl}auth/login`,loginUser,
    {responseType:"json"});
    return res;
  }

  getUserDetailsByEmail():Observable<SuccessResponse|ErrorResponse>{
    const email = this.tokenService.getUserEmail();
    const res = this.http.get<SuccessResponse | ErrorResponse>(`${this.apiUrl}users/by-email?email=`+email,
    {responseType:"json"});
    return res;
  }

  createUser(createUser:CreateUser):Observable<SuccessResponse|ErrorResponse>{
    return this.http.post<SuccessResponse | ErrorResponse>(`${this.apiUrl}users`,createUser,{responseType:"json"});
  }

  updateUser(id:number|null|undefined,user:any):Observable<SuccessResponse|ErrorResponse>{
    return this.http.patch<SuccessResponse|ErrorResponse>(`${this.apiUrl}users/profile?id=${id}`,user,{responseType:"json"});
  }

  updatePassword(id:number|null|undefined,passwords:UpdatePassword):Observable<SuccessResponse|ErrorResponse>{
    return this.http.patch<SuccessResponse|ErrorResponse>(`${this.apiUrl}users/password?id=${id}`,passwords,{responseType:"json"});
  }

  deleteUser(id:number|null|undefined){
    return this.http.delete<SuccessResponse|ErrorResponse>(`${this.apiUrl}users?id=${id}`,{responseType:"json"});
  }

  uploadProfileImage(file:File|null,userId:number|null|undefined):Observable<SuccessResponse|ErrorResponse>{
    const formData = new FormData();
    if(file && userId){
      
      formData.append('file', file);
      formData.append('userId', userId.toString());
      
    }
    return this.http.post<SuccessResponse|ErrorResponse>(`${this.apiUrl}images/profile/upload`,formData,{responseType:"json"})
  }
}
