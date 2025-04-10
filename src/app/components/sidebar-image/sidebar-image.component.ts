import { Component, computed, inject } from '@angular/core';
import { userStore } from '../../store/user.store';

@Component({
  selector: 'app-sidebar-image',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-image.component.html',
  styleUrl: './sidebar-image.component.css'
})
export class SidebarImageComponent {
    store = inject(userStore);
    
    user = computed(() => this.store.user());

}
