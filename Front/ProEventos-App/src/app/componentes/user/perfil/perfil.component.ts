import { AccountService } from './../../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinner } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidatorField } from 'src/app/helpers/ValidatiorField';
import { User } from 'src/app/models/identity/User';
import { UserUpdate } from 'src/app/models/identity/UserUpdate';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  form!: FormGroup;
  userUpdate = { } as UserUpdate;
  user = {} as UserUpdate;

  get f(): any{
    return this.form.controls;
  }

  constructor(private fb: FormBuilder,
              public accountService: AccountService,
              private router: Router,
              private toaster: ToastrService,
              private spinner: NgxSpinner) { }

  ngOnInit() {
    this.validation();
    this.carregarUsuario();
  }

  private carregarUsuario(): void {

  }

  public validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('senha', 'confirmeSenha')
    }
    this.form = this.fb.group({
      primeiroNome: ['', Validators.required],
      titulo: ['', Validators.required],
      ultimoNome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      funcao: ['', Validators.required],
      descricao: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmeSenha: ['', Validators.nullValidator]
    }, formOptions)
  }

  public resetForm(evento : any){
    evento.preventDefault();
    this.form.reset();
  }

  public onSubmit() : void{
    if (this.form.invalid){
      return;
    }
  }

}
