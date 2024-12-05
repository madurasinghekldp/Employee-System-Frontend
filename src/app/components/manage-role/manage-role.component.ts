import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role } from '../../types/role';
import { RoleService } from '../../services/role.service';
import { HttpClientModule } from '@angular/common/http';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-role',
  standalone: true,
  imports: [FormsModule,NgFor,NgIf,HttpClientModule,ReactiveFormsModule],
  templateUrl: './manage-role.component.html',
  styleUrl: './manage-role.component.css',
  providers: [RoleService]
})
export class ManageRoleComponent implements OnInit {
  
  private readonly limit:number = 5;
  public offset:number = 0;
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

  constructor(private roleService: RoleService){
    
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(){
    this.roleService.getAllSelected(this.limit,this.offset).subscribe((res)=>{
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
    description: null
  }

  public role:Role = {
    id: null,
    name: null,
    description: null
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
      description: this.roleForm.controls.description.value
    }

    this.roleService.add(this.role).subscribe(res=>{
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
          this.roleService.update(this.selectedRole).subscribe(res=>{
            if(isSuccessResponse(res)){
              this.loadRoles();
              swalWithBootstrapButtons.fire({
                title: "Updated!",
                text: "Role has been updated.",
                icon: "success"
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
        this.roleService.delete(role).subscribe(res=>{
          if(isSuccessResponse(res)){
            this.loadRoles();
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "role has been deleted.",
              icon: "success"
            });
          }
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
