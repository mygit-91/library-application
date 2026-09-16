import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  Categories,
  GetCategoriesListRequest,
  GetCategoriesListResponse,
  AddCategoriesRequest,
  AddCategoriesResponse,
  UpdateCategoriesRequest,
  UpdateCategoriesResponse,
  DeleteCategoriesResponse,
} from '../../models/categories.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);

  getCategoriesList(input: GetCategoriesListRequest): Observable<Categories[]> {
    return this.http.post<GetCategoriesListResponse>('/api/categories/list', input).pipe(
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

  addCategories(input: AddCategoriesRequest): Observable<string> {
    return this.http.post<AddCategoriesResponse>('/api/categories/add', input).pipe(
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

  updateCategories(input: UpdateCategoriesRequest): Observable<string> {
    return this.http.put<UpdateCategoriesResponse>('/api/categories/update', input).pipe(
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

  deleteCategories(id: string): Observable<string> {
    return this.http.delete<DeleteCategoriesResponse>('/api/categories/delete?id=' + id).pipe(
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
}
