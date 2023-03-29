import { EventoService } from './../services/evento.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html'
})
export class EventosComponent implements OnInit {

  public eventos: any = [];
  public eventosFiltrados: any = [];
  widthImg: number = 60;
  margin: number = 2;
  isVisible: boolean = true;
  private _filtro: string = '';

  public get filtro() {
    return this._filtro;
  }

  public set filtro(value: string){
    this._filtro = value;
    this.eventosFiltrados = this.filtro ? this.filtroEventos(this.filtro) : this.eventos;
  }

  filtroEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLowerCase()
    return this.eventos.filter(
      (evento: any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  constructor(private eventoService: EventoService) { }

  ngOnInit(): void {
    this.getEventos();
  }

  showImage() {
    this.isVisible = !this.isVisible;
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe(
      response => {
        this.eventos = response,
        this.eventosFiltrados = this.eventos;
      },
      error => console.log(error)
   );
  }
}
