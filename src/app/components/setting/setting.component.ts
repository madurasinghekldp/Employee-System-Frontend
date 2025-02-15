import { Component, computed, effect, inject } from '@angular/core';
import { userStore } from '../../store/user.store';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {

  store = inject(userStore);
    user = computed(() => this.store.user());
  
    firstName:string | undefined;
    lastName:string | undefined;
    email:string | undefined;
    companyName:string | undefined;
    address:string | undefined;
    registerNumber:string | undefined;
  
    constructor(){
      effect(()=>{
        this.firstName = this.user()?.firstName;
        this.lastName = this.user()?.lastName;
        this.email = this.user()?.email;
        this.companyName = this.user()?.company.name;
        this.address = this.user()?.company.address;
        this.registerNumber = this.user()?.company.registerNumber;
      });
    }

}
