import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonobarMainComponent } from './konobar-main.component';

describe('KonobarMainComponent', () => {
  let component: KonobarMainComponent;
  let fixture: ComponentFixture<KonobarMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KonobarMainComponent]
    });
    fixture = TestBed.createComponent(KonobarMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
