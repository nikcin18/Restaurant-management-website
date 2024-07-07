import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeregMainComponent } from './nereg-main.component';

describe('NeregMainComponent', () => {
  let component: NeregMainComponent;
  let fixture: ComponentFixture<NeregMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeregMainComponent]
    });
    fixture = TestBed.createComponent(NeregMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
