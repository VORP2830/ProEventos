import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {
  isCollapsed = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }
  showMenu(): boolean {
    return this.router.url != '/user/login';
  }

}
