import { Evento } from './../../../models/Evento';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { EventoService } from 'src/app/services/evento.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit{
  evento = {} as Evento;
  form!: FormGroup;
  eventoSalvar: string = 'post';

  get f(): any{
    return this.form.controls;
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
  constructor (private fb: FormBuilder,
    private localeService: BsLocaleService,
    private router: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService)
  {
    this.localeService.use('pt-br');
  };

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');
    if(eventoIdParam != null) {
      this.spinner.show();
      this.eventoSalvar = 'put';
      this.eventoService.getEventoById(+eventoIdParam).subscribe(
        (evento: Evento) => {
          this.evento = {...evento};
          this.form.patchValue(this.evento);
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar carregar evento.')
          console.log(error)
        },
        () => {this.spinner.hide();}
      )
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
      imagemUrl: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    })
  }
  resetForm() :void {
    this.form.reset();
  }

  public salvarAlteracao() : void {
    this.spinner.show();
    if(this.form.valid) {
      if(this.eventoSalvar == 'post'){
        this.evento = {... this.form.value}
        this.evento.lotes = [];
        this.evento.redesSociais = [];
        this.evento.palestrantes= [];

        this.eventoService.post (this.evento).subscribe({
          next: () => {this.toastr.success('Evento salvo com sucesso', "Sucesso")},
          error: (error: any) => {
            console.log(error);
            this.toastr.error('Erro ao salvar evento', 'Erro');
            }
        }).add(() => this.spinner.hide());
      } else{
        this.evento = {id: this.evento.id, ... this.form.value}
        this.evento.lotes = [];
        this.evento.redesSociais = [];
        this.evento.palestrantes = [];

        this.eventoService.put (this.evento).subscribe({
          next: () => {this.toastr.success('Evento salvo com sucesso', "Sucesso")},
          error: (error: any) => {
            console.log(error);
            this.toastr.error('Erro ao salvar evento', 'Erro');
            }
        }).add(() => this.spinner.hide());
      }

    }
  }

}
