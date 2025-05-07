import { Component, inject, OnInit } from '@angular/core';
import { MessagesService } from '../_services/messages.service';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { TimeagoModule } from 'ngx-timeago';
import { Messages } from '../models/messages';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule, ButtonsModule, TimeagoModule, RouterLink, PaginationModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  messagesService = inject(MessagesService);
  container = 'Inbox';
  pageSize: number = 5;
  pageNumber: number = 1;
  isOutbox = this.container === 'Outbox';

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.messagesService.getMessages(this.pageNumber, this.pageSize, this.container);
  }

  onGetRoute(message: Messages){
    if(this.container === 'Outbox')
      return `/members/${message.recipientUsername}`;
    else
      return `/members/${message.senderUsername}`;
  }

  onPageChanged(event: PageChangedEvent) {
    if(this.pageNumber != event.page){
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }

  deleteMessage(id: number){
    this.messagesService.deleteMessage(id).subscribe({
      next: _ => {
        this.messagesService.paginatedResult.update(prev => {
          if(prev && prev.items) {
            prev.items.splice(prev.items.findIndex(m => m.id === id), 1);
          }
          return prev;
        })
      }
    });
  }
}
