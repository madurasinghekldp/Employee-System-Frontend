import { Component } from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [MatSlideToggleModule,MatChipsModule],
  templateUrl: './performance.component.html',
  styleUrl: './performance.component.css'
})
export class PerformanceComponent {

}
