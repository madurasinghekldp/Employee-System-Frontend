import { Component, OnInit } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
import { Store } from '@ngrx/store';
import { loadUser } from '../../store/user.actions';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule,HttpClientModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  providers: [TokenService,UserService]
})
export class LayoutComponent implements OnInit {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly store: Store, 
    private readonly router: Router
  ){}
  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(){
    if(this.tokenService.validateTokenFromCookies()){
      const email = this.tokenService.getUserEmail();
      if(email){
        this.userService.getUserDetailsByEmail(email).subscribe(res=>{
          if(isSuccessResponse(res)){
            this.store.dispatch(loadUser(res.data))
          }
          else if(isErrorResponse(res)){
            this.router.navigate(["/login"]);
          }
          else{
            this.router.navigate(["/login"]);
          }
        });
      }
      else{
        this.router.navigate(["/login"]);
      }
    }
    else{
      console.log("token issue")
    }
  }


}
