import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HasRoleDirective } from '../_directive/has-role.directive';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive, HasRoleDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  accountService = inject(AccountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  model: any = {};

  onLogin(){
    if (!this.model.userName || !this.model.password) {
      this.toastr.error("User or Password must be informed");
    }
    else{
      this.accountService.onLogin(this.model).subscribe(
        {
          next: value => {
            //console.log(value);
            this.router.navigateByUrl("/members");
          },
          //error: err => this.toastr.error(err.error.message)
        }
      )
    }
  }

  onLogout() {
    this.accountService.onLogout();
    this.router.navigateByUrl("/");
  }
}
