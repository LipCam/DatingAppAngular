import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member';
import { of, tap } from 'rxjs';
import { Photo } from '../models/photo';
import { PaginatedResult } from '../models/pagination';
import { UserParams } from '../models/userParams';
import { AccountService } from './account.service';
import { onSetPaginatedResponse, onSetPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  memberCache = new Map();
  user = this.accountService.currentUser();
  userParams = signal<UserParams>(new UserParams(this.user));
  
  onResetUserParams(){
    this.userParams.set(new UserParams(this.user));
  }

  onGetMembers(){
    let key = Object.values(this.userParams()).join("-");
    const response = this.memberCache.get(key);

    if(response)
      return onSetPaginatedResponse(response, this.paginatedResult);

    let params = onSetPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);

    params = params.append("minAge", this.userParams().minAge);
    params = params.append("maxAge", this.userParams().maxAge);
    params = params.append("gender", this.userParams().gender);
    params = params.append("orderBy", this.userParams().orderBy);

    return this.http.get<Member[]>(`${this.baseUrl}users`, {observe: 'response', params}).subscribe({
      //next: members => this.members.set(members)
      next: response => {
        onSetPaginatedResponse(response, this.paginatedResult);
        this.memberCache.set(key,response);
      }
    });
  }

  onGetMember(userName: string){    
    const member: Member = [...this.memberCache.values()]
    .reduce((arr, elem) => arr.concat(elem.body), [])
    .find((m: Member) => m.userName === userName);

    if(member)
      return of(member);

    return this.http.get<Member>(`${this.baseUrl}users/` + userName);
  }

  onUpdateMember(member: Member){
    return this.http.put(this.baseUrl + "users", member).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => m.userName === member.userName ? member : m))
      // })
    );
  }

  onSetMainPhoto(photo: Photo) {
    return this.http.put(`${this.baseUrl}users/set-main-photo/${photo.id}`, {}).pipe(
      // tap(() => {
      //   this.members.update(memb => memb.map(m => {
      //     if(m.photos.includes(photo)){
      //       m.photoUrl = photo.url;
      //     }
      //     return m;
      //   }))       
      // })
    );
  }

  onDeletePhoto(photo: Photo) {
    return this.http.delete(`${this.baseUrl}users/delete-photo/${photo.id}`).pipe(
      // tap(() => {
      //   this.members.update(memb => memb.map(m => {
      //     if(m.photos.includes(photo)){
      //       m.photos = m.photos.filter(x => x.id !== photo.id);
      //     }
      //     return m;
      //   }))       
      // })
    );
  }
}
