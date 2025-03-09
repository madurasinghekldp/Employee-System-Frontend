import { Component, effect} from '@angular/core';
import { RouterModule} from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,NgIf,CommonModule,AdminDashboardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  
  public isUserLogedIn: boolean = false;
  public isAdmin: boolean|undefined = false;
  isUser:boolean|undefined = false;
  isEmployee:boolean|undefined = false;

  constructor(
    private readonly authService:AuthService
  ){
    effect(()=>{
          this.isUserLogedIn = this.authService.isUserLogedIn();
          this.isAdmin = this.authService.isAdmin();
          this.isUser = this.authService.isUser();
          this.isEmployee = this.authService.isEmployee();
        });
  }

}
