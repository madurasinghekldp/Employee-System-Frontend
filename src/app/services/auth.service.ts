import { Injectable, signal } from '@angular/core';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly tokenService: TokenService) {
    this.isUserLogedIn.set(this.tokenService.validateTokenFromLocalStorage());
    this.isAdmin.set(this.tokenService.getUserRoles()?.includes("ROLE_ADMIN"));
    this.isUser.set(this.tokenService.getUserRoles()?.includes("ROLE_USER"));
    this.isEmployee.set(this.tokenService.getUserRoles()?.includes("ROLE_EMP"));
  }

  isUserLogedIn = signal<boolean>(this.tokenService.validateTokenFromLocalStorage());
  isAdmin = signal<boolean | undefined>(this.tokenService.getUserRoles()?.includes("ROLE_ADMIN"));
  isUser = signal<boolean | undefined>(this.tokenService.getUserRoles()?.includes("ROLE_USER"));
  isEmployee = signal<boolean | undefined>(this.tokenService.getUserRoles()?.includes("ROLE_EMP"));
}
