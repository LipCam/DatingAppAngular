import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserLikesService } from '../_services/user-likes.service';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [MemberCardComponent, FormsModule, ButtonsModule, PaginationModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit, OnDestroy {
  userLikesService = inject(UserLikesService);
  predicate: string = "liked"
  pageNumber: number = 1;
  pageSize: number = 5;

  ngOnInit(): void {
    this.onGetUserLikes();
  }

  ngOnDestroy(): void {
    this.userLikesService.paginatedResult.set(null);
  } 

  onGetTitle(){
    switch(this.predicate){
      case "liked":
        return "Member you like";
      case "likedBy":
        return "Member who like you";
      default:
        return "Mutual";
    }
  }

  onGetUserLikes(){
    this.userLikesService.onGetUserLikes(this.predicate, this.pageNumber, this.pageSize);
  }

  onPageChanged(event: PageChangedEvent) {
      if(this.pageNumber != event.page){
        this.pageNumber = event.page;
        this.onGetUserLikes();
      }
    }
}
