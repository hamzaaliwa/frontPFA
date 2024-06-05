import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = AppComponent.baseUrl + '/api/v1/auth/login';

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  authenticate(email: string, password: string) {
    return this.http
      .post(this.baseUrl, {
        email: email,
        password: password,
      })
      .pipe(
        map((res: any) => {
          if (res.statusCode === 500 && res.message === "Bad credentials") {
            throw new Error("Bad credentials");
          }
          this.tokenStorageService.saveToken(res.token);
          return res; // Return response to the caller
        }),
        catchError((error: HttpErrorResponse) => {
            return throwError(() => new Error('Authentication failed')); // Propagate error
          })
      );
  }
}
