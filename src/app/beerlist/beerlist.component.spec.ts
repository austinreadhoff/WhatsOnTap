import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeerlistComponent } from './beerlist.component';

describe('BeerlistComponent', () => {
  let component: BeerlistComponent;
  let fixture: ComponentFixture<BeerlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeerlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
