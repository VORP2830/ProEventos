import { ToastrService } from 'ngx-toastr';
import { PalestranteService } from 'src/app/services/palestrante.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, map, tap } from 'rxjs';
import { Palestrante } from 'src/app/models/Palestrante';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.css']
})
export class PalestranteDetalheComponent implements OnInit {
  public form!: FormGroup;
  public situacaoDoForm = '';
  public corDaDescricao = '';

  constructor(
              private fb: FormBuilder,
              public palestranteService: PalestranteService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService
            ) { }

  ngOnInit() {
    this.validation();
    this.verificaForm();
    this.carregarPalestrante();
  }

  public get f(): any {
    return this.form.controls;
  }

  private validation() {
    this.form = this.fb.group({
      miniCurriculo: ['']
    })
  }

  private carregarPalestrante(): void {
    this.spinner.show();
    this.palestranteService.getPalestrante().subscribe(
      (palestrante: Palestrante) => {
        this.form.patchValue(palestrante)
      },
      (error) => {
        this.toastr.error('Erro ao carregar dadso do palestrante', 'Erro')
      }
    ).add(() => this.spinner.hide());
  }

  private verificaForm(): void {
    this.form.valueChanges.pipe(map(() => {
      this.situacaoDoForm = 'Minicurrículo esta sendo atualizado!';
      this.corDaDescricao = 'text-warning';
    }),
    debounceTime(1000),
    tap(() => this.spinner.show())
    ).subscribe(
      () => {
        this.palestranteService.put({...this.form.value}).subscribe(() => {
          this.situacaoDoForm = 'Minicurrículo foi atualizado!';
          this.corDaDescricao = 'text-success';
          setTimeout(() => {
            this.situacaoDoForm = 'Minicurrículo foi carregado!';
            this.corDaDescricao = 'text-mute';
          }, 1000)
        },
        () => {
          this.toastr.error('Erro ao tentat atualizar palestrante', 'Erro')
        }
        ).add(() => this.spinner.hide());
      }
    )
  }
}
