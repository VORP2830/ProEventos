import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidatorField } from 'src/app/helpers/ValidatiorField';
import { UserUpdate } from 'src/app/models/identity/UserUpdate';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.css']
})
export class PerfilDetalheComponent implements OnInit {
  @Output() changeFormValue = new EventEmitter();
  form!: FormGroup;
  userUpdate = { } as UserUpdate;
  public imagemUrl = '';

  get f(): any{
    return this.form.controls;
  }

  constructor(private fb: FormBuilder,
              public accountService: AccountService,
              private router: Router,
              private toaster: ToastrService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.validation();
    this.carregarUsuario();
    this.verificaForm();
  }

  private verificaForm(): void {
    this.form.valueChanges.subscribe(() => this.changeFormValue.emit({...this.form.value}));
  }

  private carregarUsuario(): void {
    this.spinner.show();
    this.accountService.getUser().subscribe(
      (userRetorno: UserUpdate) => {
        this.userUpdate = userRetorno;
        this.form.patchValue(this.userUpdate);
      },
      (error: any) => {
        console.log(error);
        this.toaster.error('Erro ao carregar usuário', 'Erro');
        this.router.navigate(['/dashboard'])
      }
    ).add(() => this.spinner.hide());
  }

  public validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('senha', 'confirmeSenha')
    }
    this.form = this.fb.group({
      imagemUrl: [''],
      userName: [''],
      primeiroNome: ['', Validators.required],
      titulo: ['NaoInformado', Validators.required],
      ultimoNome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      funcao: ['NaoInformado', Validators.required],
      descricao: ['', Validators.required],
      senha: ['', [Validators.nullValidator, Validators.minLength(6)]],
      confirmeSenha: ['', Validators.nullValidator]
    }, formOptions)
  }

  public resetForm(evento : any){
    evento.preventDefault();
    this.form.reset();
  }

  public onSubmit() : void{
    this.atualizarUsuario();
  }

  public atualizarUsuario(): void {
    this.userUpdate = {...this.form.value}
    this.spinner.show();

    this.accountService.updateUser(this.userUpdate).subscribe(
      () => this.toaster.success('Usuário atualizado!', 'Sucesso'),
      (error: any) => {
        console.log(error)
        this.toaster.error(error.error);
      }
    ).add(() => this.spinner.hide())
  }

}
