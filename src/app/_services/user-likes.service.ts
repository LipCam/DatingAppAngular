import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';
import { onSetPaginatedResponse, onSetPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class UserLikesService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likeIds = signal<number[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  onToogleLike(targetId: number){
    return this.http.post(`${this.baseUrl}UserLikes/${targetId}`, {})
  }

  onGetUserLikes(predicate: string, pageNumber: number, pageSize: number){
    let params = onSetPaginationHeaders(pageNumber, pageSize);

    params = params.append("predicate", predicate);

    return this.http.get<Member[]>(`${this.baseUrl}UserLikes`, {observe: 'response', params}).subscribe({
      next: response => onSetPaginatedResponse(response, this.paginatedResult)
    })
  }

  onGetCurrentUserLikeIds(){
    this.http.get<number[]>(`${this.baseUrl}UserLikes/list`).subscribe({
      next: ids => this.likeIds.set(ids)
    })
  }
}
