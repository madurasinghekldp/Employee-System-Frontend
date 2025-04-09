import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUser } from '../../types/createUser';
import { Company } from '../../types/company';
import { UserService } from '../../services/user.service';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import Swal from 'sweetalert2';
import { NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { userStore } from '../../store/user.store';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf,HttpClientModule,NgFor,SpinnerComponent],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  store = inject(userStore);
  get user() {
    return this.store.user(); 
  }
  loading:boolean = false;

  constructor(private readonly userService:UserService){}

  roleSet:Set<string> = new Set();
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
      userRoleName:[],
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
        userRoleName: Array.from(this.roleSet),
        company: this.createCompany
      }
  
      if(this.userRegForm.valid){
        this.loading = true;
        this.userService.createUser(this.createUser).subscribe(res =>{
          this.loading = false;
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
            
          }
          this.userRegForm.reset();
          this.roleSet.clear();
        });
      }
  
    }

    selectRole(event: Event){
      this.roleSet.add((event.target as HTMLSelectElement).value);
    }

    getRoleArray(){
      return Array.from(this.roleSet);
    }

    removeRole(role: string){
      this.roleSet.delete(role);
      if(this.roleSet.size === 0){
        this.userRegForm.controls.userRole?.setErrors({'required':true});
      }
    }

}
