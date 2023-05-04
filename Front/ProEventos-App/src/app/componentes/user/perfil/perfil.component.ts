import { AccountService } from './../../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserUpdate } from 'src/app/models/identity/UserUpdate';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  public user = { } as UserUpdate;
  file!: File;
  public imagemUrl = '';

  public get ehPalestrante(): boolean {
    return this.user.funcao == 'Palestrante';
  }

  constructor(private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private accountService: AccountService) { }

  ngOnInit() {

  }

  public getFormValue(user: UserUpdate): void {
    this.user = user;
    if(this.user.imagemUrl){
      this.imagemUrl = environment.apiURL + `/resources/perfil/${this.user.imagemUrl}`;
    }else {
      this.imagemUrl = '../../../../../assets/sem-foto-perfil.jpg'
    }
  }

  public onFileChange(ev : any) : void{
    const reader = new FileReader();
    reader.onload = (event : any) => this.imagemUrl = event.target.result;
    this.file = ev.target.files[0];
    reader.readAsDataURL(this.file);
    this.uploadImage();
  }

  private uploadImage(): void {
    this.spinner.show();
    this.accountService.postUpload(this.file).subscribe(
      () => this.toastr.success('Imagem atualizada com sucesso', 'Sucesso!'),
      (error: any) => {
        this.toastr.error('Erro ao atualizar a imagem', 'Erro');
        console.log(error)
      }
    ).add(() => this.spinner.hide())
  }
}
