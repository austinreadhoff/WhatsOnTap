import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ITap } from '../models/tap';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class TapService {
  constructor(private http: HttpClient) { }

  getAllTaps(url:string): Observable<ITap[]>{
    return this.http.get<ITap[]>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getCount(url:string): Observable<number>{
    return this.http.get<number>(`${url}/GetCount`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  createTap(url:string, tap: ITap): Observable<any>{
    return this.http.post(url, JSON.stringify(tap), httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateTap(url:string, id:number, tap:ITap): Observable<any>{
    return this.http.put(`${url}/${id}`, JSON.stringify(tap), httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteTap(url:string, id:number): Observable<any>{
    return this.http.delete(`${url}/${id}`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
