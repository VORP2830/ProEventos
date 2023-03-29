import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EventoService {
baseURL = 'http://localhost:5155/api/Eventos';
constructor(private http: HttpClient) { }

getEventos() {
  return this.http.get(this.baseURL);
}

}
