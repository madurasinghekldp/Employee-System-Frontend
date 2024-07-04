import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [FormsModule,HttpClientModule,CommonModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent {

  constructor(private http: HttpClient){
    
  }

  public employee={
    firstName:undefined,
    lastName:undefined,
    email:undefined,
    departmentId:undefined,
    roleId:undefined
  }

  addEmployee(){
    console.log(this.employee);
    this.http.post("http://localhost:8080/emp/add",this.employee).subscribe(data =>{

      Swal.fire({
        title: "Success!",
        text: "New Employee Added!",
        icon: "success"
      });
    });
  }

}
