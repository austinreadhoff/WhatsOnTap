import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaplistComponent } from './taplist.component';

describe('TaplistComponent', () => {
  let component: TaplistComponent;
  let fixture: ComponentFixture<TaplistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaplistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
