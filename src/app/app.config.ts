import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { provideStore } from '@ngrx/store';
import { userReducer } from './store/user.reducer';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(),
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
    }, provideStore({ user: userReducer })]
};
