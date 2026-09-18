import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  BorrowData,
  GetBorrowListRequest,
  GetBorrowListResponse,
  AddBorrowRequest,
  AddBorrowResponse,
  ReturnBookRequest,
  ReturnBookResponse,
} from '../../models/borrow.model';

@Injectable({
  providedIn: 'root',
})
export class BorrowService {
  private http = inject(HttpClient);

  getBorrowingsList(input: GetBorrowListRequest): Observable<BorrowData[]> {
    return this.http.post<GetBorrowListResponse>('/api/borrowings/list', input).pipe(
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

  addBorrowings(input: AddBorrowRequest): Observable<string> {
    return this.http.post<AddBorrowResponse>('/api/borrowings/add', input).pipe(
      map((response) => {
        // console.log('API Sucess Response:', response);
        return response.message;
      }),
      catchError((error: HttpErrorResponse) => {
        // console.error('API Error Response:', error);
        const errorMessage = error.error?.message || error.message || 'Internal Error';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  returnBook(input: ReturnBookRequest): Observable<string> {
    return this.http.put<ReturnBookResponse>('/api/borrowings/return', input).pipe(
      map((response) => {
        // console.log('API Sucess Response:', response);
        return response.message;
      }),
      catchError((error: HttpErrorResponse) => {
        // console.error('API Error Response:', error);
        const errorMessage = error.error?.message || error.message || 'Internal Error';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
