import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit{
  modalRef?: BsModalRef;

  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  widthImg: number = 60;
  margin: number = 2;
  isVisible: boolean = true;
  private filtroListado: string = '';
  eventoId: number = 0;

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
    private spinner: NgxSpinnerService,
    private router: Router
    ) { }

  public ngOnInit(): void {
    this.spinner.show();
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
      error: (error: any) => {
        console.log(error);
        this.toastr.error('Erro ao carregar os eventos', 'Erro!');
      },
      complete: () => this.spinner.hide()
    })
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.eventoService.deleteEvento(this.eventoId).subscribe({
      next: (result: string) => {
        console.log(result)
          this.toastr.success("Excluido com sucesso!", "Deletado");
          this.spinner.hide();
          this.getEventos();
      },
      error: (error: any) => {
        this.toastr.error('Erro ao deletar o evento', 'Erro');
        this.spinner.hide();
        console.log(error)
      },
      complete: () => { this.spinner.hide();}
    })

  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number) :void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
