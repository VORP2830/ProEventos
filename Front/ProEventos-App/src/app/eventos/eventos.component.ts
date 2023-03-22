import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public eventos: any = [
    {
    Tema: "Angular",
    Local: "Belo Horizonte"
    },
    {
      Tema: ".NET 7.0",
      Local: "São Paulo"
    },
    {
      Tema: "TypeScript",
      Local: "Rio de Janeiro"
    }

  ]


  constructor() {}

  ngOnInit(): void {

  }
}
