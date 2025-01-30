import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUser } from '../../types/createUser';
import { Company } from '../../types/company';
import { UserService } from '../../services/user.service';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { userStore } from '../../store/user.store';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf,HttpClientModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  store = inject(userStore);
  
  
  get user() {
    return this.store.user(); // Access user reactively
  }

  constructor(private userService:UserService){}

  userRegForm = new FormGroup({
      firstName: new FormControl('',Validators.required),
      lastName: new FormControl('',Validators.required),
      email: new FormControl('',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl('',Validators.required),
      userRole: new FormControl('',Validators.required)
    });

  public createUser:CreateUser = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      userRoleName:'',
      company:null
    }
  
  public createCompany: Company = {
    id:null,
    name: '',
    address: '',
    registerNumber: ''
  }

  submitRegForm(){

    if(this.user){
      this.createCompany = {
        id: this.user.company.id,
        name: this.user.company.name,
        address: this.user.company.address,
        registerNumber: this.user.company.registerNumber
      }
    }
      this.createUser = {
        firstName: this.userRegForm.controls.firstName?.value,
        lastName: this.userRegForm.controls.lastName?.value,
        email: this.userRegForm.controls.email?.value,
        password: this.userRegForm.controls.password?.value,
        userRoleName: this.userRegForm.controls.userRole?.value,
        company: this.createCompany
      }
  
      if(this.userRegForm.valid){
            this.userService.createUser(this.createUser).subscribe(res =>{
              if(isSuccessResponse(res)){
                Swal.fire({
                  title: "Success!",
                  text: "Add User is successfull",
                  icon: "success"
                }).then(()=>{
                  this.userRegForm.reset();
                });
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
