import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  GetBookRequest,
  GetBookListResponse,
  Books,
  AddNewBook,
  AddNewBookResponse,
} from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);

  getBooks(credentials: GetBookRequest): Observable<Books[]> {
    return this.http.post<GetBookListResponse>('/api/books/get', credentials).pipe(
      map((response) => {
        console.log('API Response:', response);
        return response.data;
      }),
      catchError((error: HttpErrorResponse) => {
        //console.error('API Error:', error.message);
        const errorMessage = error.error?.message || error.message || 'Internal Error';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  addNewBooks(credentials: AddNewBook): Observable<AddNewBookResponse> {
    return this.http.post<AddNewBookResponse>('/api/books/add', credentials).pipe(
      map((response) => {
        console.log('API Response:', response);
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        //console.error('API Error:', error.message);
        const errorMessage = error.error?.message || error.message || 'Internal Error';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
