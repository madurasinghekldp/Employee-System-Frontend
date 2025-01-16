import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUser } from '../../types/createUser';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css'
})
export class UserRegistrationComponent {

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
    password: ''
  }

  submitRegForm(){
    this.createUser = {
      firstName: this.userRegForm.controls.firstName?.value,
      lastName: this.userRegForm.controls.lastName?.value,
      email: this.userRegForm.controls.email?.value,
      password: this.userRegForm.controls.password?.value
    }

  }

}
