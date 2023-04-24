import { AccountService } from './../../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserLogin } from 'src/app/models/identity/UserLogin';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  model = {} as UserLogin;

  constructor(public accountService: AccountService,
                private router: Router,
                private toaster: ToastrService) {}

  ngOnInit(): void {

  }

  public login() {
    this.accountService.login(this.model).subscribe(
      () => { this.router.navigateByUrl('/home'); },
      (error: any) => {
        if(error.status == 401) {
          this.toaster.error('Usuário ou senha invalido')
        }
        else {
          console.log(error)
        }
      }
    )
  }
}
