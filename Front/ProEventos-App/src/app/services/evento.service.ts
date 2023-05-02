import { PaginationResult } from './../models/Pagination';
import { Evento } from './../models/Evento';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class EventoService {
  baseURL = `${environment.apiURL}/api/Eventos`;

  constructor(private http: HttpClient) { }

  public getEventos(page?: number, itemsPerPage?: number, term?: string): Observable<PaginationResult<Evento[]>> {
    const paginationResult: PaginationResult<Evento[]> = new PaginationResult<Evento[]>();
    let params = new HttpParams;
    if(page != null && itemsPerPage != null){
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString())
    }
    if(term != null && term != '')
      params = params.append('term', term)

    return this.http.get<Evento[]>(this.baseURL, { observe: 'response', params }).pipe(take(1), map((response: any) => {
      paginationResult.result = response.body;
      if(response.headers.has('Pagination')) {
        paginationResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginationResult
    }));
  }

  public getEventosByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseURL}/${tema}/tema`).pipe(take(1));
  }

  public getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseURL}/${id}`).pipe(take(1));
  }

  public post(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.baseURL}`, evento).pipe(take(1));
  }

  public put(evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseURL}/${evento.id}`, evento).pipe(take(1));
  }

  public deleteEvento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/${id}`).pipe(take(1));
  }

  public postUpload(eventoId: number, file: File): Observable<Evento> {
    const fileToUpload = file as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);
    return this.http.post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData).pipe(take(1))
  }
}
