import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department } from '../../types/department';
import { DepartmentService } from '../../services/department.service';
import { HttpClientModule } from '@angular/common/http';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';

@Component({
  selector: 'app-manage-department',
  standalone: true,
  imports: [NgFor,FormsModule,ReactiveFormsModule,NgIf,HttpClientModule],
  templateUrl: './manage-department.component.html',
  styleUrl: './manage-department.component.css',
  providers:[DepartmentService]
})
export class ManageDepartmentComponent implements OnInit {

  private readonly limit:number = 5;
  public offset:number = 0;
  public departmentList:Department[] = [];
  public departmentMessage:string = "";

  departmentForm = new FormGroup({
    name: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required)
  })

  constructor(private departmentService: DepartmentService){

  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(){
    this.departmentService.getAllSelected(this.limit,this.offset).subscribe(res=>{
      if(isSuccessResponse(res)){
        this.departmentList = res.data;
        this.departmentMessage = "";
      }
      else if(isErrorResponse(res)){
        this.departmentList = [];
        this.departmentMessage = res.message;
      }
      else{
        this.departmentList = [];
        this.departmentMessage = "Unexpected error occurred";
      }
    })
  }

  goToNextPage(){
    this.offset +=5 ;
    this.loadDepartments();
  }

  goToPreviousPage(){
    if(this.offset>0){
      this.offset -= 5;
      this.loadDepartments();
    }
  }
  

  public selectedDepartment:Department = {
    id: null,
    name: null,
    description: null
  }

  

  newDepartment = {
    id: 0, // Will be auto-generated
    name: '',
    description: ''
  };

  isEditing = false;
  editingIndex: number | null = null;

  addDepartment() {
    // if (this.isEditing) {
    //   // Save changes if editing an existing department
    //   if (this.editingIndex !== null) {
    //     this.departments[this.editingIndex] = { ...this.newDepartment };
    //   }
    //   this.isEditing = false;
    //   this.editingIndex = null;
    // } else {
    //   // Generate a new ID for the department
    //   const newId = this.departments.length + 1;
    //   this.departments.push({ ...this.newDepartment, id: newId });
    // }

    // // Clear the form
    // this.newDepartment = { id: 0, name: '', description: '' };
  }

  editDepartment(department: Department) {
    // Load the department details into the form for editing
    // this.newDepartment = { ...department };
    // this.isEditing = true;
    // this.editingIndex = this.departments.findIndex(d => d.id === department.id);
  }

  deleteDepartment(department: Department) {
    // Remove the department by ID
    //this.departments = this.departments.filter(department => department.id !== id);
  }

}
