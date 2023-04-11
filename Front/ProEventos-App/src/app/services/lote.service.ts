import { Lote } from './../models/Lote';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';

@Injectable()
export class LoteService {
  baseURL = 'http://localhost:5155/api/lotes';

  constructor(private http: HttpClient) { }

  public getLotesByEventoId(eventoId: number): Observable<Lote[]> {
    return this.http.get<Lote[]>(`${this.baseURL}/${eventoId}`).pipe(take(1));
  }

  public saveLotes(eventoId: number, lotes: Lote[]): Observable<Lote> {
    return this.http.put<Lote>(`${this.baseURL}/${eventoId}`, lotes).pipe(take(1));
  }

  public deleteLote(eventoId: number, loteId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/${eventoId}/${loteId}`).pipe(take(1));
  }

}
