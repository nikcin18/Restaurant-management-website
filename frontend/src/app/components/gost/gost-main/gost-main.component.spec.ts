import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GostMainComponent } from './gost-main.component';

describe('GostMainComponent', () => {
  let component: GostMainComponent;
  let fixture: ComponentFixture<GostMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GostMainComponent]
    });
    fixture = TestBed.createComponent(GostMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
