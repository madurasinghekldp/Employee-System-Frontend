import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleUpdatePopupComponent } from './role-update-popup.component';
import { FormBuilder } from '@angular/forms';

describe('RoleUpdatePopupComponent', () => {
  let component: RoleUpdatePopupComponent;
  let fixture: ComponentFixture<RoleUpdatePopupComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleUpdatePopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleUpdatePopupComponent);
    component = fixture.componentInstance;

    // Create a mock form
    formBuilder = new FormBuilder();
    component.roleFormUpdate = formBuilder.group({
      name: [''], // add the controls expected by your component's template
      description: ['']
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
