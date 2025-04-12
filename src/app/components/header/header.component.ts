import { Component, computed, effect, inject, OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import { userStore } from '../../store/user.store';
import { NgIf } from '@angular/common';
import { TokenService } from '../../services/token.service';
import { AuthService } from '../../services/auth.service';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTableModule} from '@angular/material/table';
import { NotificationService } from '../../services/notification.service';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,NgIf,MatBadgeModule,MatTableModule,HttpClientModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers:[TokenService,NotificationService]
})
export class HeaderComponent implements OnInit {

  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ){
    effect(()=>{
      this.isUserLogedIn = this.authService.isUserLogedIn();
      this.isAdmin = this.authService.isAdmin();
      this.isUser = this.authService.isUser();
      this.isEmployee = this.authService.isEmployee();
      this.companyLogo = this.user()?.company.logo;
      this.loadNotifications();
    });
  }
  
  store = inject(userStore);
  user = computed(() => this.store.user());
  
  isUserLogedIn:boolean = false;
  isAdmin:boolean|undefined = false;
  isUser:boolean|undefined = false;
  isEmployee:boolean|undefined = false;
  companyLogo:string|undefined;

  displayedColumns: string[] = ['message'];
  dataSource = [];
  clickedRows = new Set();
  notificationCount = 0;
  hidden = true;

  ngOnInit(): void {
    this.loadNotifications();
    
  }

  loadNotifications(){
    this.notificationService.getAllNotifications(this.user()?.id).subscribe((res)=>{
      if(isSuccessResponse(res)){
        this.dataSource = res.data;
        this.notificationCount = res.data.length;
        if(this.notificationCount > 0){
          this.hidden = false;
        }
      }else if(isErrorResponse(res)){
        this.dataSource = [];
      }
    });
  }

  rowClicked(row:any){
    this.clickedRows.add(row);
    this.notificationService.markAsRead(row.id).subscribe((res)=>{
      if(isSuccessResponse(res)){
        this.loadNotifications();
      }else if(isErrorResponse(res)){
        console.error(res.message);
      }
    });
  }

}