import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse } from '../../models/login.model';
import { UserState } from '../../states/user.state';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private userState = inject(UserState);

  // Login
  login(input: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/staff/login', input).pipe(
      tap((response) => {
        // console.log('API Sucess Response:', response);
        if (response && response.status == 200) {
          this.userState.saveSession(response.data);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // console.error('API Error Response:', error);
        const errorMessage = error.error?.message || error.message || 'Internal Error';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  // Logout
  logout(): void {
    this.userState.clearSession();
  }

  // Check is login
  isLoggedIn(): boolean {
    return this.userState.isLoggedIn();
  }
}
