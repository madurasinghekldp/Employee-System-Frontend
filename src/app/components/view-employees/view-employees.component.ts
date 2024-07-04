import { NgFor } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-employees',
  standalone: true,
  imports: [HttpClientModule,FormsModule,NgFor],
  templateUrl: './view-employees.component.html',
  styleUrl: './view-employees.component.css'
})
export class ViewEmployeesComponent {

  public employeeList:any = [];

  constructor(private http: HttpClient) {
    this.loadEmployeeTable();
  }

  loadEmployeeTable(){
    this.http.get("http://localhost:8080/emp/get-all").subscribe(res=>{
      this.employeeList = res;
    });
  }

}
