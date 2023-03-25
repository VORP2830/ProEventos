import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public eventos: any = [];
  widthImg: number = 60;
  margin: number = 2;
  isVisible: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getEventos();
  }

  showImage() {
    this.isVisible = !this.isVisible;
  }

  public getEventos(): void {
    this.http.get('http://localhost:5155/api/Eventos').subscribe(
      response => this.eventos = response,
      error => console.log(error)
   );
  }
}
