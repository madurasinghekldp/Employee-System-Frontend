import { Component, inject, OnInit } from '@angular/core';
import { RouterModule} from '@angular/router';
import { Observable } from 'rxjs';
import { UserData } from '../../store/user.model';
import { UserState } from '../../store/user.state';
import { CommonModule, NgIf } from '@angular/common';
import { userStore } from '../../store/user.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,NgIf,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    
  }
  store = inject(userStore);

}
