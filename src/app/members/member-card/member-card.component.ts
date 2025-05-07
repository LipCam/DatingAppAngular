import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../models/member';
import { RouterLink } from '@angular/router';
import { UserLikesService } from '../../_services/user-likes.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  private userLikesService = inject(UserLikesService);
  member = input.required<Member>();
  hasLiked = computed(() => this.userLikesService.likeIds().includes(this.member().id));

  onToogleLike(){
    this.userLikesService.onToogleLike(this.member().id).subscribe({
      next: () => {
        if(this.hasLiked()){
          this.userLikesService.likeIds.update(ids => ids.filter(p=> p !== this.member().id));
        } else{
          this.userLikesService.likeIds.update(ids => [...ids, this.member().id]);
        }
      } 
    });
  }
}
