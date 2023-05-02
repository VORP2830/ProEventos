import { UserUpdate } from './../models/identity/UserUpdate';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, map, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/identity/User';
@Injectable()
export class AccountService {
  private currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  baseUrl = `${environment.apiURL}/api/account`

  constructor(private http: HttpClient) { }

  public login(model: any): Observable<void> {
    return this.http.post<User>(this.baseUrl + '/login', model).pipe(
      take(1),
      map((response: User) => {
      const user = response;
      if(user){
        this.setCurrentUser(user);
      }
    })
    );
  }

  public register(model: any): Observable<void> {
    return this.http.post<User>(this.baseUrl + '/register', model).pipe(
      take(1),
      map((response: User) => {
      const user = response;
      if(user){
        this.setCurrentUser(user);
      }
    })
    );
  }

  getUser(): Observable<UserUpdate> {
    return this.http.get<UserUpdate>(this.baseUrl + '/getuser').pipe(take(1));
  }

  updateUser(model: UserUpdate): Observable<void> {
    return this.http.put<UserUpdate>(this.baseUrl + '/updateuser', model).pipe(
      take(1),
      map((user: UserUpdate) => {
        this.setCurrentUser(user);
      })
    )
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null as any);
    this.currentUserSource.complete();
  }

  public setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  public postUpload(file: File): Observable<UserUpdate> {
    const fileToUpload = file as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);
    return this.http.post<UserUpdate>(`${this.baseUrl}/upload-image`, formData).pipe(take(1))
  }
}
