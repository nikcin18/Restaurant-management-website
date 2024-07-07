import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatKonobariComponent } from './stat-konobari.component';

describe('StatKonobariComponent', () => {
  let component: StatKonobariComponent;
  let fixture: ComponentFixture<StatKonobariComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatKonobariComponent]
    });
    fixture = TestBed.createComponent(StatKonobariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
