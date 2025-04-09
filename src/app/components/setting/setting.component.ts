import { Component, computed, effect, inject } from '@angular/core';
import { userStore } from '../../store/user.store';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { UpdatePassword } from '../../types/update-password';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,HttpClientModule,CommonModule,SpinnerComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
  providers:[UserService,CompanyService]
})
export class SettingComponent {

  store = inject(userStore);
  user = computed(() => this.store.user());
  loading: boolean = false;
  
  firstName:string | undefined;
  lastName:string | undefined;
  email:string | undefined;
  companyName:string | undefined;
  address:string | undefined;
  registerNumber:string | undefined;

  userForm = new FormGroup({
    firstName: new FormControl('',Validators.required),
    lastName: new FormControl('',Validators.required),
    email: new FormControl('',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
  })

  companyForm = new FormGroup({
    name: new FormControl('',Validators.required),
    address: new FormControl('',Validators.required),
    registerNumber: new FormControl('',Validators.required),
    annualLeaves: new FormControl(0,Validators.required),
    casualLeaves: new FormControl(0,Validators.required)
  })

  passwordForm = new FormGroup({
    oldPassword: new FormControl('',Validators.required),
    newPassword: new FormControl('',Validators.required)
  })

  profileImageForm = new FormGroup({
    profileImage: new FormControl<string|null>(null,Validators.required)
  })

  companyImageForm = new FormGroup({
    companyImage: new FormControl<string|null>(null,Validators.required)
  })

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly companyService: CompanyService,
    private readonly router: Router
    ){
    effect(()=>{
      this.firstName = this.user()?.firstName;
      this.lastName = this.user()?.lastName;
      this.email = this.user()?.email;
      this.companyName = this.user()?.company.name;
      this.address = this.user()?.company.address;
      this.registerNumber = this.user()?.company.registerNumber;

      this.userForm.patchValue({
        firstName: this.user()?.firstName,
        lastName: this.user()?.lastName,
        email: this.user()?.email
      });

      this.companyForm.patchValue({
        name: this.user()?.company.name,
        address: this.user()?.company.address,
        registerNumber: this.user()?.company.registerNumber,
        annualLeaves: this.user()?.company.annualLeaves,
        casualLeaves: this.user()?.company.casualLeaves
      });
    });
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

  selectedProfileImage: File | null = null;
  selectedLogoImage: File | null = null;

  onProfileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedProfileImage = target.files[0];
      this.profileImageForm.patchValue({ profileImage: this.selectedProfileImage.name });
      console.log("Selected file:", this.selectedProfileImage);
    }
  }

  onLogoSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedLogoImage = target.files[0];
      this.companyImageForm.patchValue({ companyImage: this.selectedLogoImage.name });
      console.log("Selected file:", this.selectedLogoImage);
    }
  }

  updateUser(){
    if(this.userForm.valid){
      const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
          },
          buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, update it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading = true;
            this.userService.updateUser(this.user()?.id,this.userForm.value).subscribe(res=>{
              if(isSuccessResponse(res)){
                this.loading = false;
                localStorage.removeItem('token');
                this.store.loadUsers(null);
                this.store.loadRoles(null);
                this.authService.isUserLogedIn.set(this.tokenService.validateTokenFromLocalStorage());
                this.authService.isAdmin.set(this.tokenService.getUserRoles()?.includes("ROLE_ADMIN"));
                this.authService.isUser.set(this.tokenService.getUserRoles()?.includes("ROLE_USER"));
                this.authService.isEmployee.set(this.tokenService.getUserRoles()?.includes("ROLE_EMP"));
                this.router.navigate(["/login"]);
                swalWithBootstrapButtons.fire({
                  title: "Updated!",
                  text: "User has been updated. Please login",
                  icon: "success"
                });
              }
              else if(isErrorResponse(res)){
                this.loading = false;
                swalWithBootstrapButtons.fire({
                  title: "Update Error!",
                  text: res.message,
                  icon: "error"
                });
              }
              else{
                this.loading = false;
                swalWithBootstrapButtons.fire({
                  title: "Update Error!",
                  text: "User has not been updated.",
                  icon: "error"
                });
              }
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
              title: "Cancelled",
              text: "User has not been updated.",
              icon: "error"
            });
          }
        });
    }
  }

  updateCompany(){
    const company = {
      id: this.user()?.company.id,
      ...this.companyForm.value
    }
    if(this.companyForm.valid){
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          this.companyService.updateCompany(company).subscribe(res=>{
            if(isSuccessResponse(res)){
              this.store.updateCompany({company: res.data});
              this.loading = false;
              swalWithBootstrapButtons.fire({
                title: "Updated!",
                text: "Company has been updated",
                icon: "success"
              });
            }
            else if(isErrorResponse(res)){
              this.loading = false;
              swalWithBootstrapButtons.fire({
                title: "Update Error!",
                text: res.message,
                icon: "error"
              });
            }
            else{
              this.loading = false;
              swalWithBootstrapButtons.fire({
                title: "Update Error!",
                text: "Company has not been updated.",
                icon: "error"
              });
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Company has not been updated.",
            icon: "error"
          });
        }
        
      });
      
    }
  }
  
  updateProfileImage(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    if(this.profileImageForm.valid){
      this.loading = true;
      this.userService.uploadProfileImage(this.selectedProfileImage,this.user()?.id).subscribe(res=>{
        if(isSuccessResponse(res)){
          this.loading = false;
          swalWithBootstrapButtons.fire({
            title: "Success!",
            text: "Profile image updated.",
            icon: "success"
          });
          this.loadUserDetails();
        }
        else if(isErrorResponse(res)){
          this.loading = false;
          swalWithBootstrapButtons.fire({
            title: "Error!",
            text: "Profile image has not been updated.",
            icon: "error"
          });
        }
        this.loading = false;
        this.profileImageForm.controls.profileImage.reset();
      })
    }
  }

  updateCompanyImage(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    if(this.companyImageForm.valid){
      this.loading = true;
      this.companyService.uploadCompanyImage(this.selectedLogoImage,this.user()?.company?.id).subscribe(res=>{
        if(isSuccessResponse(res)){
          this.loading = false;
          swalWithBootstrapButtons.fire({
            title: "Success!",
            text: "Company image updated.",
            icon: "success"
          });
          this.loadUserDetails();
        }
        else if(isErrorResponse(res)){
          this.loading = false;
          swalWithBootstrapButtons.fire({
            title: "Error!",
            text: "Company image has not been updated.",
            icon: "error"
          });
        }
        this.loading = false;
        this.companyImageForm.controls.companyImage.reset();
      })
    }
  }

  deactivateAccount(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(this.user()?.id).subscribe(res=>{
          if(isSuccessResponse(res)){
            localStorage.removeItem('token');
            this.store.loadUsers(null);
            this.store.loadRoles(null);
            this.authService.isUserLogedIn.set(this.tokenService.validateTokenFromLocalStorage());
            this.authService.isAdmin.set(this.tokenService.getUserRoles()?.includes("ROLE_ADMIN"));
            this.router.navigate(["/login"]);
            swalWithBootstrapButtons.fire({
              title: "Deactivated!",
              text: "Your account has been deactivated",
              icon: "success"
            });
          }
          else if(isErrorResponse(res)){
            swalWithBootstrapButtons.fire({
              title: "Deactivate Error!",
              text: res.message,
              icon: "error"
            });
          }
          else{
            swalWithBootstrapButtons.fire({
              title: "Deactivate Error!",
              text: "Your account has been deactivated",
              icon: "error"
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Deactivate Cancelled!",
          icon: "error"
        });
      }
    });
  }

  updatePassword(){
    const passwords = {
      oldPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword
    } as UpdatePassword;
    if(this.passwordForm.valid){
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          this.userService.updatePassword(this.user()?.id,passwords).subscribe(res=>{
            if(isSuccessResponse(res)){
              this.loading = false;
              swalWithBootstrapButtons.fire({
                title: "Updated!",
                text: "Password has been updated",
                icon: "success"
              });
              this.passwordForm.reset();
            }
            else if(isErrorResponse(res)){
              this.loading = false;
              swalWithBootstrapButtons.fire({
                title: "Update Error!",
                text: res.message,
                icon: "error"
              });
            }
            else{
              this.loading = false;
              swalWithBootstrapButtons.fire({
                title: "Update Error!",
                text: "Password has not been updated.",
                icon: "error"
              });
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Password has not been updated.",
            icon: "error"
          });
        }
      });
    }
  }

}