import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeregPocetnaComponent } from './nereg-pocetna.component';

describe('NeregPocetnaComponent', () => {
  let component: NeregPocetnaComponent;
  let fixture: ComponentFixture<NeregPocetnaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeregPocetnaComponent]
    });
    fixture = TestBed.createComponent(NeregPocetnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
