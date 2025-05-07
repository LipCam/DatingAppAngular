import { inject, Injectable, OnInit, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Messages } from '../models/messages';
import { PaginatedResult } from '../models/pagination';
import { onSetPaginatedResponse, onSetPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  paginatedResult = signal<PaginatedResult<Messages[]> | null>(null);

  getMessages(pageNumber: number, pageSize: number, container: string){
    let params = onSetPaginationHeaders(pageNumber, pageSize);
    params = params.append("Container", container);

    return this.http.get<Messages[]>(`${this.baseUrl}messages`, {observe: 'response', params}).subscribe({
      next: response => {
        onSetPaginatedResponse(response, this.paginatedResult);
      }
    });
  }

  getMessageThread(username: string){
    return this.http.get<Messages[]>(`${this.baseUrl}messages/thread/${username}`);
  }

  sendMessage(userName: string, content: string){
    return this.http.post<Messages>(this.baseUrl + 'messages', {recipientUsername: userName, content});
  }

  deleteMessage(id: number){
    return this.http.delete(`${this.baseUrl}messages/${id}`);
  }
}
