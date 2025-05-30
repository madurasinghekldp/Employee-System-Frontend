import { NgFor, NgIf } from '@angular/common';
import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role } from '../../types/role';
import { RoleService } from '../../services/role.service';
import { HttpClientModule } from '@angular/common/http';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import Swal from 'sweetalert2';
import { RoleUpdatePopupComponent } from '../role-update-popup/role-update-popup.component';
import { userStore } from '../../store/user.store';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-manage-role',
  standalone: true,
  imports: [FormsModule,NgFor,NgIf,HttpClientModule,ReactiveFormsModule,RoleUpdatePopupComponent,SpinnerComponent],
  templateUrl: './manage-role.component.html',
  styleUrl: './manage-role.component.css',
  providers: [RoleService]
})
export class ManageRoleComponent implements OnInit {

  store = inject(userStore);
  user = computed(() => this.store.user());
  loading:boolean = false;
  private readonly limit:number = 5;
  public offset:number = 0;
  public searchText:string = '';
  public roleList:Role[] = [];
  public roleMessage:string = "";

  roleForm = new FormGroup({
    name: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required)
  })

  roleFormUpdate = new FormGroup({
    name: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required)
  })

  constructor(private readonly roleService: RoleService){
    effect(()=>{
      this.loadRoles();
    });
  }

  ngOnInit(): void {
    
  }

  onInputChange(event:any){
    this.loadRoles();
  }

  loadRoles(){
    if(this.user()){
      this.roleService.getAllSelected(this.user()?.company.id,this.limit,this.offset,this.searchText).subscribe((res)=>{
        if(isSuccessResponse(res)){
          this.roleList = res.data;
          this.roleMessage = "";
        }
        else if(isErrorResponse(res)){
          this.roleList = [];
          this.roleMessage = res.message;
        }
        else{
          this.roleList = [];
          this.roleMessage = "Unexpected error occurred";
        }
      })
    }
  }

  goToNextPage(){
    this.offset +=5 ;
    this.loadRoles();
  }

  goToPreviousPage(){
    if(this.offset>0){
      this.offset -= 5;
      this.loadRoles();
    }
  }

  public selectedRole:Role = {
    id: null,
    name: null,
    description: null,
    company: undefined
  }

  public role:Role = {
    id: null,
    name: null,
    description: null,
    company: undefined
  }

  loadUpdateModel(role:Role){
    this.selectedRole = {...role};
    this.roleFormUpdate.patchValue({
      name: role.name,
      description: role.description
    })
  }

  prepareToUpdate(){
    this.selectedRole.name = this.roleFormUpdate.controls.name.value;
    this.selectedRole.description = this.roleFormUpdate.controls.description.value;
  }

  addRole() {
    this.role = {
      id: null,
      name: this.roleForm.controls.name.value,
      description: this.roleForm.controls.description.value,
      company: this.user()?.company
    }

    if(this.roleForm.valid){
      this.loading = true;
      this.roleService.add(this.role).subscribe(res=>{
        this.loading = false;
        if(isSuccessResponse(res)){
          Swal.fire({
            title: "Success!",
            text: "New Role Added!",
            icon: "success"
          });
          this.roleForm.reset();
          this.loadRoles();
        }
        else if(isErrorResponse(res)){
          Swal.fire({
            title: "Failed!",
            text: res.message,
            icon: "error"
          });
          this.roleForm.reset();
        }
      })
    }
  }

  updateRole() {
    this.prepareToUpdate();
    if(this.selectedRole.id){
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
          this.roleService.update(this.selectedRole).subscribe(res=>{
            this.loading = false;
            if(isSuccessResponse(res)){
              this.loadRoles();
              swalWithBootstrapButtons.fire({
                title: "Updated!",
                text: "Role has been updated.",
                icon: "success"
              });
            }
            else if(isErrorResponse(res)){
              swalWithBootstrapButtons.fire({
                title: "Update Error!",
                text: res.message,
                icon: "error"
              });
            }
            else{
              swalWithBootstrapButtons.fire({
                title: "Update Error!",
                text: "Role has not been updated.",
                icon: "error"
              });
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Role has not been updated.",
            icon: "error"
          });
        }
      });
    }
    
  }

  deleteRole(role: Role) {
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
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.roleService.delete(role).subscribe(res=>{
          this.loading = false;
          if(isSuccessResponse(res)){
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "role has been deleted.",
              icon: "success"
            });
          }
          else if(isErrorResponse(res)){
            swalWithBootstrapButtons.fire({
              title: "Cannot delete!",
              text: res.message,
              icon: "error"
            });
          }
          this.loadRoles();
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "role has not been deleted.",
          icon: "error"
        });
      }
    });
  }
}
