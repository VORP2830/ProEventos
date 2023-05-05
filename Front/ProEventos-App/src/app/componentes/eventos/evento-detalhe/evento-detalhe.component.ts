import { Evento } from 'src/app/models/Evento';
import { LoteService } from './../../../services/lote.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { EventoService } from 'src/app/services/evento.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Lote } from 'src/app/models/Lote';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit{
  eventoId: number = 0;
  evento = {} as Evento;
  lote = {} as Lote;
  form!: FormGroup;
  eventoSalvar: string = 'post';
  modalRef?: BsModalRef;
  loteAtual = {id: 0, indice: 0};
  imagemUrl = 'assets/sem-foto.jpg'
  file!: File;

  get f(): any{
    return this.form.controls;
  }

  get lotes() : FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get modoEditar(): boolean {
    return this.eventoSalvar == 'put';
  }
  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    }
  }

  get bsConfigLote(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false
    }
  }
  constructor (private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private loteService: LoteService,
    private modalService: BsModalService)
  {
    this.localeService.use('pt-br');
  };

  public carregarEvento(): void {
    const eventoId = this.activatedRouter.snapshot.paramMap.get('id');
    if(eventoId != null) {
      this.spinner.show();
      this.eventoSalvar = 'put';
      this.eventoService.getEventoById(+eventoId).subscribe(
        (evento: Evento) => {
          this.evento = {...evento};
          this.form.patchValue(this.evento);
          if(this.evento.imagemUrl != ''){
            this.imagemUrl = `${environment.apiURL}/resources/images/${this.evento.imagemUrl}`
          }
          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criarLote(lote));
          })
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar carregar evento.')
          console.log(error)
        }
      ).add(() => this.spinner.hide());
    }
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void{
    this.form = this.fb.group({
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      imagemUrl: [''],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([])
    })
  }

  adicionarLote(): void {
    (this.lotes).push(this.criarLote({id: 0} as Lote))
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id || 0],
      nome: [lote.nome, Validators.required],
      preco: [lote.preco, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      dateInicio: [lote.dateInicio],
      dateFim: [lote.dateFim],

    })
  }

  public retornaTituloLote(nome: string) {
    return nome == null || nome == '' ? 'Nome do lote' : nome;
  }

  resetForm() :void {
    this.form.reset();
  }

  public salvarAlteracao() : void {
    this.spinner.show();
    if(this.form.valid) {
      if(this.eventoSalvar == 'post'){
        this.evento = {... this.form.value}

        this.eventoService.post (this.evento).subscribe({
          next: (eventoRetorno: any) => {
            console.log(eventoRetorno)
            this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
            this.toastr.success('Evento salvo com sucesso', "Sucesso");
          },
          error: (error: any) => {
            console.log(error);
            this.toastr.error('Erro ao salvar evento', 'Erro');
            }
        }).add(() => this.spinner.hide());
      } else{
        this.evento = {id: this.evento.id, ... this.form.value}
        this.eventoService.put (this.evento).subscribe({
          next: () => {
            this.toastr.success('Evento salvo com sucesso', "Sucesso")
          },
          error: (error: any) => {
            console.log(error);
            this.toastr.error('Erro ao salvar evento', 'Erro');
            }
        }).add(() => this.spinner.hide());
      }

    }
  }

  public salvarLotes(): void {
    this.spinner.show();
    if(this.form.controls['lotes'].valid) {
      this.loteService.saveLotes(this.evento.id, this.form.value.lotes).subscribe(
        {
          next: () => {
            this.toastr.success('Lotes salvos com sucesso!', 'Sucesso');
            this.lotes.reset();
          },
          error: (error: any) => {
            this.toastr.error('Erro ao tentar salvar os lotes', 'Erro')
            console.log(error);
          }
        }
      ).add(() => this.spinner.hide());
    }
  }

  public removerLote(template: TemplateRef<any>, indice: number): void {
    this.loteAtual.id = this.lotes.get(indice + '.id')?.value;
    this.loteAtual.indice = indice

    this.modalRef = this.modalService.show(template,{class: 'modal-sm'});
    this.lotes.removeAt(indice);
  }

  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.loteService.deleteLote(this.eventoId, this.loteAtual.id).subscribe({
      next: () => {
        this.toastr.success('Lote deletado com sucesso!', 'Sucesso');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      error: (error: any) => {
        this.toastr.error('Erro ao deletar o lote');
        console.log(error)
      }
    }).add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef?.hide();
  }

  public onFileChange(ev : any) : void{
    const reader = new FileReader();
    reader.onload = (event : any) => this.imagemUrl = event.target.result;
    this.file = ev.target.files[0];
    reader.readAsDataURL(this.file);
    this.uploadImage();
  }

  uploadImage(): void {
    this.spinner.show();
    this.eventoService.postUpload(this.evento.id, this.file).subscribe({
      next: () => {
        this.carregarEvento();
        this.toastr.success('Imagem atualizado com sucesso!', 'Sucesso');
      },
      error: (error: any) => {
        this.toastr.error('Erro ao fazer upload da imagem!', 'Erro')
        console.log(error);
      }
    }).add(() => this.spinner.hide());
  }

  public idEvento() {
    let id: any = this.activatedRouter.snapshot.paramMap.get('id');
    return +id;
  }
}
