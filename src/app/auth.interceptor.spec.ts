import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        AuthInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header if token exists', () => {
    localStorage.setItem('token', 'dummy-token');

    const req = new HttpRequest('GET', '/test');
    const handler: HttpHandler = {
      handle: (request) => {
        expect(request.headers.has('Authorization')).toBeTrue();
        expect(request.headers.get('Authorization')).toBe('Bearer dummy-token');
        return of(new HttpResponse({ status: 200 }));
      }
    };

    interceptor.intercept(req, handler).subscribe();
  });
});
