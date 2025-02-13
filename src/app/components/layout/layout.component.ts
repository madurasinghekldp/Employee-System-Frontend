import { AfterViewInit, ChangeDetectorRef, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { userStore } from '../../store/user.store';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { NgIf } from '@angular/common';
import { UserLoginComponent } from '../user-login/user-login.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule,HttpClientModule,NgIf],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  providers: [TokenService,UserService]
})
export class LayoutComponent implements OnInit{

  store = inject(userStore);
  
  get user() {
    return this.store.user();
  }
  get roles() {
    return this.store.roles();
  }

  public isUserLogedIn: boolean = false;
  public isAdmin: boolean|undefined = false;

  
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ){
    
  }
  ngOnInit(): void {
    this.loadUserDetails();
    this.isUserLogedIn = this.tokenService.validateTokenFromLocalStorage();
    this.isAdmin = this.tokenService.getUserRoles()?.includes("ROLE_ADMIN");
    
  }


  async loadUserDetails(){
    this.userService.getUserDetailsByEmail().subscribe(res=>{
      if(isSuccessResponse(res)) {
        this.store.loadUsers(res.data);
        this.store.loadRoles(this.tokenService.getUserRoles());
      }
      else if(isErrorResponse(res)) {
        this.store.loadUsers(null);
        this.store.loadRoles(null);
      }
    })
  }


}
