import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { userStore } from '../../store/user.store';
import { NgIf } from '@angular/common';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers:[TokenService]
})
export class HeaderComponent implements OnInit {

  constructor(private readonly tokenService: TokenService){}
  
  store = inject(userStore);
  
  get user() {
    return this.store.user();
  }

  public isUserLogedIn: boolean = false;
  public isAdmin: boolean|undefined = false;

  ngOnInit(): void {
    this.isUserLogedIn = this.tokenService.validateTokenFromLocalStorage();
    this.isAdmin = this.tokenService.getUserRoles()?.includes("ROLE_ADMIN");
  }


}