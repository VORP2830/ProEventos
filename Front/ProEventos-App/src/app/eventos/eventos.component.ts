import { Evento } from '../models/Evento';
import { EventoService } from './../services/evento.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
})
export class EventosComponent implements OnInit {

  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  widthImg: number = 60;
  margin: number = 2;
  isVisible: boolean = true;
  private filtroListado: string = '';

  public get filtro() {
    return this.filtroListado;
  }

  public set filtro(value: string){
    this.filtroListado = value;
    this.eventosFiltrados = this.filtro ? this.filtroEventos(this.filtro) : this.eventos;
  }

  public filtroEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLowerCase()
    return this.eventos.filter(
      (evento: any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  constructor(private eventoService: EventoService) { }

  public ngOnInit(): void {
    this.getEventos();
  }

  public showImage() {
    this.isVisible = !this.isVisible;
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => console.log(error)
    })
  }
}
