import { Pagination, PaginationResult } from './../../../models/Pagination';
import { Palestrante } from './../../../models/Palestrante';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';
import { PalestranteService } from 'src/app/services/palestrante.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html'
})
export class PalestranteListaComponent implements OnInit {
  public Palestrantes: Palestrante[] = [];
  public pagination = {} as Pagination;

  constructor(
    private palestranteService: PalestranteService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  public ngOnInit() {
    this.pagination = { currentPage: 1, itemsPerPages: 3, totalItems: 1} as Pagination;
    this.getPalestrantes();
  }
  termoBuscaChanged: Subject<string> = new Subject<string>();

  public filtroPlestrante(evt: any): void {
    if(this.termoBuscaChanged.observers.length == 0) {
      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe(
        filtrarPor => {
            this.spinner.show();
            this.palestranteService.getPalestrantes(this.pagination.currentPage, this.pagination.itemsPerPages, filtrarPor).subscribe({
            next: (paginationResult: PaginationResult<Palestrante[]>) => {
              this.Palestrantes = paginationResult.result;
              this.pagination = paginationResult.pagination;
            },
            error: (error: any) => {
              console.log(error);
              this.toastr.error('Erro ao carregar os palestrantes', 'Erro!');
            }
          }).add(() => this.spinner.hide());
        }
      )
    }
    this.termoBuscaChanged.next(evt.value);
  }

  public getImagemUrl(imagemName: string): string {
    if(imagemName){
      return environment.apiURL + `/resources/perfil/${imagemName}`;
    }else {
      return './assets/sem-foto-perfil.jpg'
    }
  }

  public getPalestrantes(): void {
    this.spinner.show();
    this.palestranteService.getPalestrantes(this.pagination.currentPage, this.pagination.itemsPerPages).subscribe({
      next: (paginationResult: PaginationResult<Palestrante[]>) => {
        this.Palestrantes = paginationResult.result;
        this.pagination = paginationResult.pagination;
        console.log(paginationResult.result)
      },
      error: (error: any) => {
        console.log(error);
        this.toastr.error('Erro ao carregar os palestrantes', 'Erro!');
      }
    }).add(() => this.spinner.hide());
  }

}
