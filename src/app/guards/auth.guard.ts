import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';


export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  if (tokenService.validateTokenFromLocalStorage()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const adminGuard: CanActivateFn = (route, state)=>{
  const tokenService = inject(TokenService);
  if(tokenService.getUserRoles()?.includes("ROLE_ADMIN")){
    return true;
  }else{
    return false;
  }
}

export const userGuard: CanActivateFn = (route, state)=>{
  const tokenService = inject(TokenService);
  if(tokenService.getUserRoles()?.includes("ROLE_USER")){
    return true;
  }else{
    return false;
  }
}

export const empGuard: CanActivateFn = (route, state)=>{
  const tokenService = inject(TokenService);
  if(tokenService.getUserRoles()?.includes("ROLE_EMP")){
    return true;
  }else{
    return false;
  }
}

export const adminOrUserGuard: CanActivateFn = (route, state)=>{
  const tokenService = inject(TokenService);
  if(tokenService.getUserRoles()?.includes("ROLE_ADMIN")||tokenService.getUserRoles()?.includes("ROLE_USER")){
    return true;
  }else{
    return false;
  }
}
