import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';
import { Evento } from 'src/app/models/Evento';
import { Pagination, PaginationResult } from 'src/app/models/Pagination';
import { EventoService } from 'src/app/services/evento.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements OnInit {
  public pagination = {} as Pagination;
  public eventos: Evento[] = [];

  constructor(
    private eventoService: EventoService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit() {
    this.pagination = { currentPage: 1, itemsPerPages: 3, totalItems: 1} as Pagination;
    this.getAllEventos();
  }

  termoBuscaChanged: Subject<string> = new Subject<string>();

  public filtroEventos(evt: any): void {
    if(this.termoBuscaChanged.observers.length == 0) {
      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe(
        filtrarPor => {
            this.spinner.show();
            this.eventoService.getAllEventos(this.pagination.currentPage, this.pagination.itemsPerPages, filtrarPor).subscribe({
            next: (paginationResult: PaginationResult<Evento[]>) => {
              this.eventos = paginationResult.result;
              this.pagination = paginationResult.pagination;
            },
            error: (error: any) => {
              console.log(error);
              this.toastr.error('Erro ao carregar os eventos', 'Erro!');
            }
          }).add(() => this.spinner.hide());
        }
      )
    }
    this.termoBuscaChanged.next(evt.value);
  }
  public getAllEventos():void {
    this.spinner.show();
    this.eventoService.getAllEventos(this.pagination.currentPage, this.pagination.itemsPerPages).subscribe({
      next: (paginationResult: PaginationResult<Evento[]>) => {
        this.eventos = paginationResult.result;
        this.pagination = paginationResult.pagination;
      },
      error: (error: any) => {
        console.log(error);

        this.toastr.error('Erro ao carregar os eventos', 'Erro!');
      }
    }).add(() => this.spinner.hide());
  }

  public getImagemUrl(imagemName: string): string {
    if(imagemName){
      return environment.apiURL + `/resources/Images/${imagemName}`;
    }else {
      return './assets/sem-foto-perfil.jpg'
    }
  }

  public pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.getAllEventos()
  }

}
