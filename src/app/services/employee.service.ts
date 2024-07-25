import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }

  getCount(){
    return this.http.get("http://localhost:8080/emp/count");
  }

  getAll(){
    return this.http.get("http://localhost:8080/emp/get-all");
  }

  delete(employee:any){
    return this.http.delete(`http://localhost:8080/emp/del/${employee.id}`,{responseType:"text"});
  }

  update(selectedEmployee:any){
    return this.http.put(`http://localhost:8080/emp/update`,selectedEmployee);
  }

  add(employee:any){
    return this.http.post("http://localhost:8080/emp/add",employee);
  }
}
