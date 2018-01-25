import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSwitchComponent } from './button-switch.component';

describe('ButtonSwitchComponent', () => {
  let component: ButtonSwitchComponent;
  let fixture: ComponentFixture<ButtonSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
