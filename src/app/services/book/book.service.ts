import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  GetBookByIdResponse,
  GetBookListRequest,
  GetBookListResponse,
  Books,
  AddBookRequest,
  AddBookResponse,
  UpdateBookRequest,
  UpdateBookResponse,
  DeleteBookResponse,
} from '../../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);

  getBookById(bookId: string): Observable<Books[]> {
    return this.http.get<GetBookByIdResponse>('/api/book/get-byid?id=' + bookId).pipe(
      map((response) => {
        console.log('API Sucess Response:', response);
        return response.data;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('API Error Response:', error);
        const errorMessage = error.error?.message || error.message || 'Internal Error';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  getBookList(input: GetBookListRequest): Observable<Books[]> {
    return this.http.post<GetBookListResponse>('/api/book/list', input).pipe(
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

  addBook(input: AddBookRequest): Observable<string> {
    return this.http.post<AddBookResponse>('/api/book/add', input).pipe(
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

  updateBook(input: UpdateBookRequest): Observable<string> {
    return this.http.post<UpdateBookResponse>('/api/book/update', input).pipe(
      map((response) => {
        console.log('API Sucess Response:', response);
        return response.message;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('API Error Response:', error);
        const errorMessage = error.error?.message || error.message || 'Internal Error';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  deleteBook(bookId: string): Observable<string> {
    return this.http.delete<DeleteBookResponse>('/api/book/delete?id=' + bookId).pipe(
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
