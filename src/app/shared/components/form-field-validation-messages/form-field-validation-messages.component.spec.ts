import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldValidationMessagesComponent } from './form-field-validation-messages.component';

describe('FormFieldValidationMessagesComponent', () => {
  let component: FormFieldValidationMessagesComponent;
  let fixture: ComponentFixture<FormFieldValidationMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFieldValidationMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldValidationMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
