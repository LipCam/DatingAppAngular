import { Component, inject, input, OnInit, output, ViewChild, viewChild } from '@angular/core';
import { MessagesService } from '../../_services/messages.service';
import { Messages } from '../../models/messages';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent {
  @ViewChild("messageForm") messageForm?: NgForm;
  private messagesService = inject(MessagesService);
  userName = input.required<string>();
  messages = input.required<Messages[]>();
  messageContent = "";
  updateMessages = output<Messages>();

  onSendMessage(){
    this.messagesService.sendMessage(this.userName(), this.messageContent).subscribe({
      next: message =>{
        this.updateMessages.emit(message);
        this.messageForm?.reset();
      }
    })
  }
}
