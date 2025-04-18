import { Component, computed, effect, inject,OnInit} from '@angular/core';
import { RouterModule} from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { userStore } from '../../store/user.store';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SidebarImageComponent } from '../sidebar-image/sidebar-image.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule,HttpClientModule,NgIf,SidebarImageComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  providers: [TokenService,UserService]
})
export class LayoutComponent implements OnInit{

  store = inject(userStore);
  
  user = computed(() => this.store.user());
  get roles() {
    return this.store.roles();
  }

  public isUserLogedIn: boolean = false;
  public isAdmin: boolean|undefined = false;
  isUser:boolean|undefined = false;
  isEmployee:boolean|undefined = false;
  
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly location: Location
  ){
    effect(()=>{
      this.isUserLogedIn = this.authService.isUserLogedIn();
      this.isAdmin = this.authService.isAdmin();
      this.isUser = this.authService.isUser();
      this.isEmployee = this.authService.isEmployee();
    });
  }
  ngOnInit(): void {
    this.loadUserDetails();
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

  logout(){
    localStorage.removeItem('token');
    this.store.loadUsers(null);
    this.store.loadRoles(null);
    this.authService.isUserLogedIn.set(this.tokenService.validateTokenFromLocalStorage());
    this.authService.isAdmin.set(this.tokenService.getUserRoles()?.includes("ROLE_ADMIN"));
  }


  goBackward(){
    this.location.back();
  }


}
