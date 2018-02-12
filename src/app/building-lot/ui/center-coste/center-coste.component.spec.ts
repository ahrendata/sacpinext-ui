import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterCosteComponent } from './center-coste.component';

describe('CenterCosteComponent', () => {
  let component: CenterCosteComponent;
  let fixture: ComponentFixture<CenterCosteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterCosteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterCosteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
