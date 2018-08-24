import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IBeer } from '../models/beer';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class BeerService {
  constructor(private http: HttpClient) { }

  getAllBeers(url:string): Observable<IBeer[]>{
    return this.http.get<IBeer[]>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  createBeer(url:string, beer: IBeer): Observable<any>{
    return this.http.post(url, JSON.stringify(beer), httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateBeer(url:string, id:number, beer:IBeer): Observable<any>{
    return this.http.put(`${url}/${id}`, JSON.stringify(beer), httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteBeer(url:string, id:number): Observable<any>{
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
