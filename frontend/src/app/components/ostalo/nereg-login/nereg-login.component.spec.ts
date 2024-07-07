import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeregLoginComponent } from './nereg-login.component';

describe('NeregLoginComponent', () => {
  let component: NeregLoginComponent;
  let fixture: ComponentFixture<NeregLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeregLoginComponent]
    });
    fixture = TestBed.createComponent(NeregLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
