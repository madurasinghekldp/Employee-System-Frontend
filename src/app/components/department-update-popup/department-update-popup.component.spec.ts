import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentUpdatePopupComponent } from './department-update-popup.component';

describe('DepartmentUpdatePopupComponent', () => {
  let component: DepartmentUpdatePopupComponent;
  let fixture: ComponentFixture<DepartmentUpdatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentUpdatePopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepartmentUpdatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
