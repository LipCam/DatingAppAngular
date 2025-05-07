import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserLikesService } from './user-likes.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private userLikesService = inject(UserLikesService);
  urlBase = environment.apiUrl;
  currentUser = signal<User | null>(null);

  onLogin(model: any) {
    return this.http.post<User>(this.urlBase + "account/login", model).pipe(
      map(user =>{
        if(user) {
          this.onSetCurrentUser(user);
        }
      })
    );
  }

  onRegister(model: any) {
    return this.http.post<User>(this.urlBase + "account/register", model).pipe(
      map(user =>{
        if(user) {
          this.onSetCurrentUser(user);
        }
        return user;
      })
    );
  }

  onSetCurrentUser(user: User){
    localStorage.setItem("user", JSON.stringify(user));
    this.currentUser.set(user);
    this.userLikesService.onGetCurrentUserLikeIds();
  }

  onLogout() {
    localStorage.removeItem("user");
    this.currentUser.set(null);
  }
}
