import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StylelistComponent } from './stylelist.component';

describe('StylelistComponent', () => {
  let component: StylelistComponent;
  let fixture: ComponentFixture<StylelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StylelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StylelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
