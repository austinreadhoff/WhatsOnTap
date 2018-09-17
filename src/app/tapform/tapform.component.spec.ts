import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TapformComponent } from './tapform.component';

describe('TapformComponent', () => {
  let component: TapformComponent;
  let fixture: ComponentFixture<TapformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TapformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TapformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
