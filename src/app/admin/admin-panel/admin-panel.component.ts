import { Component } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { UserManagementComponent } from "../user-management/user-management.component";
import { PhotoManagementComponent } from "../photo-management/photo-management.component";
import { HasRoleDirective } from '../../_directive/has-role.directive';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [TabsModule, UserManagementComponent, PhotoManagementComponent, HasRoleDirective],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {

}
