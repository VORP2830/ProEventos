import { Evento } from './../models/Evento';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class EventoService {
  baseURL = 'http://localhost:5155/api/Eventos';

  constructor(private http: HttpClient) { }

  public getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseURL);
  }

  public getEventosByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseURL}/${tema}/tema`);
  }

  public getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }

  public postEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.baseURL}`, evento);
  }

  public putEvento(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseURL}/${id}`, evento);
  }

  public deleteEvento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/${id}`);
  }

}
