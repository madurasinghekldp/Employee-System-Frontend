import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentUpdatePopupComponent } from './department-update-popup.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';

describe('DepartmentUpdatePopupComponent', () => {
  let component: DepartmentUpdatePopupComponent;
  let fixture: ComponentFixture<DepartmentUpdatePopupComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentUpdatePopupComponent],
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
    
    fixture = TestBed.createComponent(DepartmentUpdatePopupComponent);
    component = fixture.componentInstance;

    // Create a mock form
    formBuilder = new FormBuilder();
    component.departmentFormUpdate = formBuilder.group({
      name: [''], // add the controls expected by your component's template
      description: ['']
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
