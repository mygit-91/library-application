import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse } from '../models/loging.model';
import { UserState } from '../state/user.state';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private userState = inject(UserState);

  // Login
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/staff/login', credentials).pipe(
      tap((response) => {
        if (response && response.status == 200) {
          this.userState.saveSession(response.data);
        }
      }),
      catchError((error: HttpErrorResponse) => {
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
