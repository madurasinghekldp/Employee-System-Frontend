import { Component, effect, inject, OnInit} from '@angular/core';
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
    });
  }
  
  store = inject(userStore);
  
  isUserLogedIn:boolean = false;
  isAdmin:boolean|undefined = false;


  ngOnInit(): void {
    
  }

}