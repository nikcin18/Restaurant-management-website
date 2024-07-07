import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GostDostavaComponent } from './gost-dostava.component';

describe('GostDostavaComponent', () => {
  let component: GostDostavaComponent;
  let fixture: ComponentFixture<GostDostavaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GostDostavaComponent]
    });
    fixture = TestBed.createComponent(GostDostavaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
