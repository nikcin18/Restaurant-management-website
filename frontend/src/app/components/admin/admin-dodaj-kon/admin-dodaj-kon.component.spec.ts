import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDodajKonComponent } from './admin-dodaj-kon.component';

describe('AdminDodajKonComponent', () => {
  let component: AdminDodajKonComponent;
  let fixture: ComponentFixture<AdminDodajKonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDodajKonComponent]
    });
    fixture = TestBed.createComponent(AdminDodajKonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
