import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginationResult } from '../models/Pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, take } from 'rxjs';
import { Palestrante } from '../models/Palestrante';

@Injectable({
  providedIn: 'root'
})
export class PalestranteService {
  baseURL = `${environment.apiURL}/api/palestrantes`;

  constructor(private http: HttpClient) { }

  public getPalestrantes(page?: number, itemsPerPage?: number, term?: string): Observable<PaginationResult<Palestrante[]>> {
    const paginationResult: PaginationResult<Palestrante[]> = new PaginationResult<Palestrante[]>();
    let params = new HttpParams;
    if(page != null && itemsPerPage != null){
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString())
    }
    if(term != null && term != '')
      params = params.append('term', term)

    return this.http.get<Palestrante[]>(this.baseURL, { observe: 'response', params }).pipe(take(1), map((response: any) => {
      paginationResult.result = response.body;
      if(response.headers.has('Pagination')) {
        paginationResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginationResult
    }));
  }

  public getPalestrante(): Observable<Palestrante> {
    return this.http.get<Palestrante>(`${this.baseURL}`).pipe(take(1));
  }

  public post(): Observable<Palestrante> {
    return this.http.post<Palestrante>(`${this.baseURL}`, {} as Palestrante).pipe(take(1));
  }

  public put(palestrante: Palestrante): Observable<Palestrante> {
    return this.http.put<Palestrante>(`${this.baseURL}`, palestrante).pipe(take(1));
  }

}
