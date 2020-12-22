import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryViewComponent } from './registry-view.component';

describe('RegistryViewComponent', () => {
  let component: RegistryViewComponent;
  let fixture: ComponentFixture<RegistryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
