import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { Pagination, PaginationResult } from 'src/app/models/Pagination';
import { EventoService } from 'src/app/services/evento.service';
import { environment } from 'src/environments/environment';

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
  public pagination = {} as Pagination;

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
    this.pagination = { currentPage: 1, itemsPerPages: 3, totalItems: 1} as Pagination;
    this.getEventos();
  }

  public showImage() {
    this.isVisible = !this.isVisible;
  }

  public mostraImagem(imagemUrl: string): string {
    return (imagemUrl != '')
    ? `${environment.apiURL}/resources/images/${imagemUrl}`
    : 'assets/sem-foto.jpg';
  }

  public getEventos(): void {
    this.spinner.show();
    this.eventoService.getEventos(this.pagination.currentPage, this.pagination.itemsPerPages).subscribe({
      next: (paginationResult: PaginationResult<Evento[]>) => {
        this.eventos = paginationResult.result;
        this.eventosFiltrados = this.eventos;
        this.pagination = paginationResult.pagination;
      },
      error: (error: any) => {
        console.log(error);

        this.toastr.error('Erro ao carregar os eventos', 'Erro!');
      }
    }).add(() => this.spinner.hide());
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
          this.getEventos();
      },
      error: (error: any) => {
        this.toastr.error('Erro ao deletar o evento', 'Erro');
        console.log(error)
      }
    }).add(() => this.spinner.hide());

  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number) :void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

  public pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.getEventos()
  }
}
