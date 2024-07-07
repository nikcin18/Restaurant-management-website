import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatProsekComponent } from './stat-prosek.component';

describe('StatProsekComponent', () => {
  let component: StatProsekComponent;
  let fixture: ComponentFixture<StatProsekComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatProsekComponent]
    });
    fixture = TestBed.createComponent(StatProsekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
