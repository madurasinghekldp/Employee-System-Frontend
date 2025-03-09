import { HttpClientModule } from '@angular/common/http';
import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { userStore } from '../../store/user.store';
import { TaskService } from '../../services/task.service';
import { LeaveService } from '../../services/leave.service';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [HttpClientModule,RouterModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css',
  providers: [TaskService,LeaveService]
})
export class EmployeeDashboardComponent  implements OnInit{
  chart: any;
  store = inject(userStore);
  user = computed(() => this.store.user());

  public taskCount:number = 0;
  public leaveCount:number = 0;
  public doughnutLabels:string[] = [];
  public doughnutData:number[] = [];
  public lineLabels:string[] = [];
  public lineData:number[] = [];

  constructor(
    private readonly taskService: TaskService,
    private readonly leaveService: LeaveService
  ){
    effect(()=>{
      this.init();
    })
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.taskService.getTaskCountByUser(this.user()?.id).subscribe(res=>{
      if(isSuccessResponse(res)){
        this.taskCount = res.data;
      }
      else if(isErrorResponse(res)){
        this.taskCount = 0;
      }
    });

    this.leaveService.getLeaveCountByUser(this.user()?.id).subscribe(res=>{
      if(isSuccessResponse(res)){
        this.leaveCount = res.data;
      }
      else if(isErrorResponse(res)){
        this.leaveCount = 0;
      }
    });
    
    this.taskService.getTasksByStatusByUser(this.user()?.id).subscribe(res=>{
      if(isSuccessResponse(res)){
        this.doughnutLabels = Object.keys(res.data);
        this.doughnutData = Object.values(res.data);
        this.createPieChart();
      }
      else if(isErrorResponse(res)){
        this.doughnutLabels = ['non'];
        this.doughnutData = [];
        this.createPieChart();
      }
    });
  }

  createPieChart() {
    const labels = this.doughnutLabels.length>0?this.doughnutLabels:["non"];
    const ctx = document.getElementById("chartjs-pie") as HTMLCanvasElement;
    
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [{
            data: this.doughnutData.length>0?this.doughnutData:[1],
            backgroundColor: this.generateRandomColors(labels.length),
            borderColor: "transparent"
          }]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  }

  createLineChart() {
    const ctx = document.getElementById('chartjs-line') as HTMLCanvasElement;

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [
            {
              label: 'Sales (in USD)',
              data: [100, 200, 150, 300, 250, 400, 350],
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.1)',
              borderWidth: 2,
              fill: true
            },
            {
              label: 'Expenses (in USD)',
              data: [80, 150, 100, 250, 200, 350, 300],
              borderColor: 'red',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              borderWidth: 2,
              fill: true
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Months'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Amount ($)'
              },
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  generateRandomColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random HEX color
      colors.push(color);
    }
    return colors;
  }
}
