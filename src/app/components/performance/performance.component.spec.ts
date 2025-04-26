import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceComponent } from './performance.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('PerformanceComponent', () => {
  let component: PerformanceComponent;
  let fixture: ComponentFixture<PerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceComponent],
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
    
    fixture = TestBed.createComponent(PerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
