import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Greska2Component } from './greska2.component';

describe('Greska2Component', () => {
  let component: Greska2Component;
  let fixture: ComponentFixture<Greska2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Greska2Component]
    });
    fixture = TestBed.createComponent(Greska2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
