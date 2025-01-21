import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member';
import { of, tap } from 'rxjs';
import { Photo } from '../models/photo';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  members = signal<Member[]>([]);
  
  onGetMembers(){
    return this.http.get<Member[]>(`${this.baseUrl}users`).subscribe({
      next: members => this.members.set(members)
    });
  }

  onGetMember(userName: string){
    const member = this.members().find(x => x.userName === userName);
    if(member !== undefined)
      return of(member);
    
    return this.http.get<Member>(`${this.baseUrl}users/` + userName);
  }

  onUpdateMember(member: Member){
    return this.http.put(this.baseUrl + "users", member).pipe(
      tap(() => {
        this.members.update(members => members.map(m => m.userName === member.userName ? member : m))
      })
    );
  }

  onSetMainPhoto(photo: Photo) {
    return this.http.put(`${this.baseUrl}users/set-main-photo/${photo.id}`, {}).pipe(
      tap(() => {
        this.members.update(memb => memb.map(m => {
          if(m.photos.includes(photo)){
            m.photoUrl = photo.url;
          }
          return m;
        }))       
      })
    );
  }

  onDeletePhoto(photo: Photo) {
    return this.http.delete(`${this.baseUrl}users/delete-photo/${photo.id}`).pipe(
      tap(() => {
        this.members.update(memb => memb.map(m => {
          if(m.photos.includes(photo)){
            m.photos = m.photos.filter(x => x.id !== photo.id);
          }
          return m;
        }))       
      })
    );
  }
}
