import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementViewComponent } from './requirement-view.component';

describe('RequirementViewComponent', () => {
  let component: RequirementViewComponent;
  let fixture: ComponentFixture<RequirementViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
