import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IStyle } from '../models/style';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class StyleService {
  constructor(private http: HttpClient) { }

  getAllStyles(url:string): Observable<IStyle[]>{
    return this.http.get<IStyle[]>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getStyleById(url:string, id:number){
    return this.http.get<IStyle>(`${url}/${id}`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  createStyle(url:string, style: IStyle): Observable<any>{
    return this.http.post(url, JSON.stringify(style), httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateStyle(url:string, id:number, style:IStyle): Observable<any>{
    return this.http.put(`${url}/${id}`, JSON.stringify(style), httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteStyle(url:string, id:number): Observable<any>{
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
