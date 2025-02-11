import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  roles: string[];
  sub: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  getDecodedToken(): DecodedToken | null {
    
    const token = localStorage.getItem('token');
    if(token){
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      return decodedToken;
    }
    return null;
  }

  validateTokenFromLocalStorage(): boolean {
    
    try {
      const decodedToken = this.getDecodedToken();
      if(decodedToken===null){
        return false;
      }
  
      const currentTime = Math.floor(Date.now() / 1000); 
      if (decodedToken.exp < currentTime) {
        return false;
      }
  
      return true;
    } catch (error) {
      return false;
    }
  }

  getUserEmail(){
    if(this.validateTokenFromLocalStorage()){
      const decodedToken = this.getDecodedToken();
      if(decodedToken===null){
        return null;
      }
      console.log(decodedToken.sub);
      return decodedToken.sub;
    }
    return null;
    
  }

  getUserRoles(){
    if(this.validateTokenFromLocalStorage()){
      const decodedToken = this.getDecodedToken();
      if(decodedToken===null){
        return null;
      }
      console.log(decodedToken.roles);
      return decodedToken.roles;
    }
    return null;
    
  }
}
