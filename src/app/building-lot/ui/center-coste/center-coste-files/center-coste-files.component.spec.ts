import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterCosteFilesComponent } from './center-coste-files.component';

describe('CenterCosteFilesComponent', () => {
  let component: CenterCosteFilesComponent;
  let fixture: ComponentFixture<CenterCosteFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterCosteFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterCosteFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
