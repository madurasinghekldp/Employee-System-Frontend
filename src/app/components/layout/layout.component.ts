import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { userStore } from '../../store/user.store';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule,HttpClientModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  providers: [TokenService,UserService]
})
export class LayoutComponent implements OnInit {

  store = inject(userStore);
  
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly router: Router
  ){
    
  }
  ngOnInit(): void {
    this.loadUserDetails();
  }

  async loadUserDetails(){
    this.userService.getUserDetailsByEmail().subscribe(res=>{
      if(isSuccessResponse(res)) this.store.loadUsers(res.data);
      else if(isErrorResponse(res)) this.store.loadUsers(null);
    })
  }


}
