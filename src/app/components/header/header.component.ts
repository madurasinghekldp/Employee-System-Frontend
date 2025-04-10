import { Component, computed, effect, inject, OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import { userStore } from '../../store/user.store';
import { NgIf } from '@angular/common';
import { TokenService } from '../../services/token.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers:[TokenService]
})
export class HeaderComponent implements OnInit {

  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService
  ){
    effect(()=>{
      this.isUserLogedIn = this.authService.isUserLogedIn();
      this.isAdmin = this.authService.isAdmin();
      this.isUser = this.authService.isUser();
      this.isEmployee = this.authService.isEmployee();
      this.companyLogo = this.user()?.company.logo;
    });
  }
  
  store = inject(userStore);
  user = computed(() => this.store.user());
  
  isUserLogedIn:boolean = false;
  isAdmin:boolean|undefined = false;
  isUser:boolean|undefined = false;
  isEmployee:boolean|undefined = false;
  companyLogo:string|undefined;


  ngOnInit(): void {
    
  }

}