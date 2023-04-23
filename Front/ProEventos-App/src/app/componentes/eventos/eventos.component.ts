import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';

import { Evento } from '../../models/Evento';
import { EventoService } from '../../services/evento.service';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
})
export class EventosComponent implements OnInit {
  modalRef?: BsModalRef;

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

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
    ) { }

  public ngOnInit(): void {

  }
}
