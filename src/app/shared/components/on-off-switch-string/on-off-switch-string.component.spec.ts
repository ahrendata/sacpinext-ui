import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnOffSwitchStringComponent } from './on-off-switch-string.component';

describe('OnOffSwitchStringComponent', () => {
  let component: OnOffSwitchStringComponent;
  let fixture: ComponentFixture<OnOffSwitchStringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnOffSwitchStringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnOffSwitchStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
