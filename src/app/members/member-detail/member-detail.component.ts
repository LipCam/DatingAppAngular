import { Component, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { Member } from '../../models/member';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { Messages } from '../../models/messages';
import { MessagesService } from '../../_services/messages.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  @ViewChild("memberTabs", {static: true}) memberTabs?: TabsetComponent;
  private memberService = inject(MembersService);
  private messagesService = inject(MessagesService);
  private route = inject(ActivatedRoute);
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Messages[] = [];

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.member && this.member.photos.map(p => {
          this.images.push(new ImageItem({ src: p.url, thumb: p.url }))
        })
      }
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.onSelectTab(params['tab'])
      }
    });
    
  }

  onUpdateMessages(event: Messages){
    this.messages.push(event);
  }

  onSelectTab(heading: string) {
    if(this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(x => x.heading === heading);
      if(messageTab)
        messageTab.active = true;
    }
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data;

    if(this.activeTab.heading === 'Messages' && this.messages.length === 0 && this.member) {
      this.messagesService.getMessageThread(this.member!.userName).subscribe({
        next: msg => this.messages = msg
      });
    }
  }

  // onLoadMember(){
  //   const username = this.route.snapshot.paramMap.get("username");
  //   this.memberService.onGetMember(username!).subscribe({
  //     next: memb => {
  //       this.member = memb;
  //       memb.photos.map(p => {
  //         this.images.push(new ImageItem({ src: p.url, thumb: p.url }))
  //       })
  //     }
  //   })
  // }
}
