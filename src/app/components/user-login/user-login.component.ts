import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginUser } from '../../types/loginUser';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf,HttpClientModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css',
  providers:[UserService,TokenService]
})
export class UserLoginComponent {

  constructor(private userService:UserService, private router: Router, private tokenService:TokenService){}

  userLoginForm = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('',Validators.required)
  });

  public loginUser:LoginUser = {
    email: '',
    password: ''
  }

  submitLoginForm(){
    this.loginUser = {
      email: this.userLoginForm.controls.email?.value,
      password: this.userLoginForm.controls.password?.value
    }
    if(this.userLoginForm.valid){
        this.userService.login(this.loginUser).subscribe(res =>{
          if(isSuccessResponse(res)){
            Swal.fire({
              title: "Success!",
              text: "Login is successfull",
              icon: "success"
            }).then(()=>{
              localStorage.setItem("token",res.data.token);
              this.userLoginForm.reset();
              this.router.navigate(["/home"]);
            });
            
          }
          else if(isErrorResponse(res)){
            Swal.fire({
              title: "Failed!",
              text: res.message,
              icon: "error"
            });
            this.userLoginForm.reset();
          }
        });
      }
  }

}
