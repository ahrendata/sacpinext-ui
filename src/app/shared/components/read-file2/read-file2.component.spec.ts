import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadFile2Component } from './read-file2.component';

describe('ReadFile2Component', () => {
  let component: ReadFile2Component;
  let fixture: ComponentFixture<ReadFile2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadFile2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadFile2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
