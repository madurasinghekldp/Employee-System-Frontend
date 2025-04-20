import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { userStore } from '../../store/user.store';
import { HttpClientModule } from '@angular/common/http';
import { DepartmentService } from '../../services/department.service';
import { isErrorResponse, isSuccessResponse } from '../../utility/response-type-check';
import { EmployeeService } from '../../services/employee.service';
import { TaskService } from '../../services/task.service';
import { RouterModule } from '@angular/router';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [HttpClientModule,RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  providers:[DepartmentService,EmployeeService,TaskService,LeaveService]
})
export class AdminDashboardComponent implements OnInit{
  store = inject(userStore);
    
  user = computed(() => this.store.user());
  public depCount:number = 0;
  public empCount:number = 0;
  public doughnutLabels:string[] = [];
  public doughnutData:number[] = [];
  public lineLabels:string[] = [];
  public lineData:number[] = [];

  pieChart: Chart | null = null;
  lineChart: Chart | null = null;

  constructor(
    private readonly departmentService: DepartmentService,
    private readonly employeeService: EmployeeService,
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

  init(){
    if(this.user()){
      this.departmentService.getCount(this.user()?.company.id).subscribe(res=>{
        if(isSuccessResponse(res)){
          this.depCount = res.data;
        }
        else if(isErrorResponse(res)){
          this.depCount = 0;
        }
      });
      this.employeeService.getCount(this.user()?.company.id).subscribe(res=>{
        if(isSuccessResponse(res)){
          this.empCount = res.data;
        }
        else if(isErrorResponse(res)){
          this.empCount = 0;
        }
      });
      this.taskService.getTasksByStatus(this.user()?.company.id).subscribe(res=>{
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
      this.leaveService.getLeaveCountsDatesByCompany(this.user()?.company.id).subscribe(res=>{
        if(isSuccessResponse(res)){
          this.lineLabels = Object.keys(res.data);
          this.lineData = Object.values(res.data);
          this.createLineChart();
        }
        else if(isErrorResponse(res)){
          this.lineLabels = ['non'];
          this.lineData = [];
          this.createLineChart();
        }
      });
    }
  }

  /* ngAfterViewInit() {
    this.createPieChart();
    this.createLineChart();
  } */

  createPieChart() {
    const labels = this.doughnutLabels.length>0?this.doughnutLabels:["non"];
    const ctx = document.getElementById("chartjs-pie") as HTMLCanvasElement;

    if (this.pieChart) {
      this.pieChart.destroy();
    }
    
    if (ctx) {
      this.pieChart = new Chart(ctx, {
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

    if (this.lineChart) {
      this.lineChart.destroy();
    }

    if (ctx) {
      this.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.lineLabels,
          datasets: [
            {
              label: 'Monthly leaves',
              data: this.lineData,
              borderColor: 'red',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              borderWidth: 2,
              fill: true
            },
            /* {
              label: 'Expenses (in USD)',
              data: [80, 150, 100, 250, 200, 350, 300],
              borderColor: 'red',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              borderWidth: 2,
              fill: true
            } */
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
                text: 'Dates'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Count'
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
