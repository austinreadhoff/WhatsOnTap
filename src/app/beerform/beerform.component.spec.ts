import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeerformComponent } from './beerform.component';

describe('BeerformComponent', () => {
  let component: BeerformComponent;
  let fixture: ComponentFixture<BeerformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeerformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeerformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
