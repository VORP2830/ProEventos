import { Component, OnInit } from '@angular/core';
import { UserUpdate } from 'src/app/models/identity/UserUpdate';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  public user = { } as UserUpdate;

  public get ehPalestrante(): boolean {
    return this.user.funcao == 'Palestrante';
  }
  
  constructor() { }

  ngOnInit() {

  }

  get f(): any{
    return '';
  }

  public getFormValue(user: UserUpdate): void {
    this.user = user;
    console.log(user)
  }
}
