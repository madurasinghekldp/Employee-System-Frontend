import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUser } from '../../types/createUser';
import { CommonModule, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf,HttpClientModule],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css',
  providers:[UserService]
})
export class UserRegistrationComponent {

  constructor(private userService:UserService, private router: Router){}

  userRegForm = new FormGroup({
    firstName: new FormControl('',Validators.required),
    lastName: new FormControl('',Validators.required),
    email: new FormControl('',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('',Validators.required),
    agreed: new FormControl('',Validators.requiredTrue)
  });

  public createUser:CreateUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userRoleName:''
  }

  submitRegForm(){
    this.createUser = {
      firstName: this.userRegForm.controls.firstName?.value,
      lastName: this.userRegForm.controls.lastName?.value,
      email: this.userRegForm.controls.email?.value,
      password: this.userRegForm.controls.password?.value,
      userRoleName: "ROLE_ADMIN"
    }

    if(this.userRegForm.valid){
          this.userService.signup(this.createUser).subscribe(res =>{
            if(isSuccessResponse(res)){
              Swal.fire({
                title: "Success!",
                text: "Signup is successfull. Please Login",
                icon: "success"
              }).then(()=>{
                this.router.navigate(["/login"]);
              });
              this.userRegForm.reset();
            }
            else if(isErrorResponse(res)){
              Swal.fire({
                title: "Failed!",
                text: res.message,
                icon: "error"
              });
              this.userRegForm.reset();
            }
          });
        }

  }

}
