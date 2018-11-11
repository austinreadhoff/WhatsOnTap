import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleformComponent } from './styleform.component';

describe('StyleformComponent', () => {
  let component: StyleformComponent;
  let fixture: ComponentFixture<StyleformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StyleformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StyleformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
