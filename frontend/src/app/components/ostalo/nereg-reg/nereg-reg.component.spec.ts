import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeregRegComponent } from './nereg-reg.component';

describe('NeregRegComponent', () => {
  let component: NeregRegComponent;
  let fixture: ComponentFixture<NeregRegComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeregRegComponent]
    });
    fixture = TestBed.createComponent(NeregRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
