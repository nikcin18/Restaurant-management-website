import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonobarDostavaComponent } from './konobar-dostava.component';

describe('KonobarDostavaComponent', () => {
  let component: KonobarDostavaComponent;
  let fixture: ComponentFixture<KonobarDostavaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KonobarDostavaComponent]
    });
    fixture = TestBed.createComponent(KonobarDostavaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
