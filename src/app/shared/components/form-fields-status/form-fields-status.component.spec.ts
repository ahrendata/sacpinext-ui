import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldsStatusComponent } from './form-fields-status.component';

describe('FormFieldsStatusComponent', () => {
  let component: FormFieldsStatusComponent;
  let fixture: ComponentFixture<FormFieldsStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFieldsStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
