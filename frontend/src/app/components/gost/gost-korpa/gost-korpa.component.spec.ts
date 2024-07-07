import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GostKorpaComponent } from './gost-korpa.component';

describe('GostKorpaComponent', () => {
  let component: GostKorpaComponent;
  let fixture: ComponentFixture<GostKorpaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GostKorpaComponent]
    });
    fixture = TestBed.createComponent(GostKorpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
