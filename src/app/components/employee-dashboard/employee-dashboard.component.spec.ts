import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EmployeeDashboardComponent } from './employee-dashboard.component';
import { ActivatedRoute } from '@angular/router';

describe('EmployeeDashboardComponent', () => {
  let component: EmployeeDashboardComponent;
  let fixture: ComponentFixture<EmployeeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDashboardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            // mock the parameters or data you use
            params: of({ id: '1' }),
            queryParams: of({}),
            snapshot: {},
          },
        },
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
