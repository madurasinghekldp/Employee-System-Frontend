import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService)

  if (tokenService.validateTokenFromLocalStorage()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

