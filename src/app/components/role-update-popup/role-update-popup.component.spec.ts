import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleUpdatePopupComponent } from './role-update-popup.component';

describe('RoleUpdatePopupComponent', () => {
  let component: RoleUpdatePopupComponent;
  let fixture: ComponentFixture<RoleUpdatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleUpdatePopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleUpdatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
