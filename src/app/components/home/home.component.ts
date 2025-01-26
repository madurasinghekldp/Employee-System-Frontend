import { Component } from '@angular/core';
import { RouterModule} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserData } from '../../store/user.model';
import { UserState } from '../../store/user.state';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,NgIf,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  user$: Observable<UserData | null>;

  constructor(private readonly store: Store<{ user: UserState }>) {
    this.user$ = this.store.select(state => state.user.user);
    console.log(this.user$);
  }
}
