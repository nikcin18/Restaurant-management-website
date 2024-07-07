import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminKonobarComponent } from './admin-konobar.component';

describe('AdminKonobarComponent', () => {
  let component: AdminKonobarComponent;
  let fixture: ComponentFixture<AdminKonobarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminKonobarComponent]
    });
    fixture = TestBed.createComponent(AdminKonobarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
