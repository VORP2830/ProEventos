import { Evento } from './../../../models/Evento';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { EventoService } from 'src/app/services/evento.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit{
  evento?: Evento;
  form!: FormGroup;

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
    this.spinner.show();
    const eventoIdParam = this.router.snapshot.paramMap.get('id');
    if(eventoIdParam != null) {
      this.eventoService.getEventoById(+eventoIdParam).subscribe(
        (evento: Evento) => {
          this.evento = {...evento};
          this.form.patchValue(this.evento);
        },
        (error: any) => {
          this.spinner.hide();
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

}
