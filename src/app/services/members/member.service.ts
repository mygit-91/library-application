import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Members, GetMemberByIdCardResponse } from '../../models/member.model';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private http = inject(HttpClient);

  getBookById(idCard: string): Observable<Members> {
    return this.http.get<GetMemberByIdCardResponse>('/api/members/get-byidcard?id=' + idCard).pipe(
      map((response) => {
        // console.log('API Sucess Response:', response);
        return response.data;
      }),
      catchError((error: HttpErrorResponse) => {
        // console.error('API Error Response:', error);
        const errorMessage = error.error?.message || error.message || 'Internal Error';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
