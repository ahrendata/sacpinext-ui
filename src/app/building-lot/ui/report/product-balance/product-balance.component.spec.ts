import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBalanceComponent } from './product-balance.component';

describe('ProductBalanceComponent', () => {
  let component: ProductBalanceComponent;
  let fixture: ComponentFixture<ProductBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
