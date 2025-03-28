import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, PaginationModule, FormsModule, ButtonsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  memberService = inject(MembersService);
  genderList = [
                {value: "male", display: "Male"}, 
                {value: "female", display: "Female"}
               ];

  ngOnInit(): void {
    if(!this.memberService.paginatedResult())
      this.onLoadMembers();
  }

  onLoadMembers(){
    this.memberService.onGetMembers();
  }

  onPageChanged(event: PageChangedEvent) {
    if(this.memberService.userParams().pageNumber != event.page){
      this.memberService.userParams().pageNumber = event.page;
      this.onLoadMembers();
    }
  }

  onResetFilter() {
    this.memberService.onResetUserParams();
    this.onLoadMembers();
  }
}
