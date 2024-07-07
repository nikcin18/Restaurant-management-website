import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatDaniComponent } from './stat-dani.component';

describe('StatDaniComponent', () => {
  let component: StatDaniComponent;
  let fixture: ComponentFixture<StatDaniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatDaniComponent]
    });
    fixture = TestBed.createComponent(StatDaniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
