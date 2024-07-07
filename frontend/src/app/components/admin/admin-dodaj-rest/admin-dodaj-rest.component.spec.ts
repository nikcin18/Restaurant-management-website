import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDodajRestComponent } from './admin-dodaj-rest.component';

describe('AdminDodajRestComponent', () => {
  let component: AdminDodajRestComponent;
  let fixture: ComponentFixture<AdminDodajRestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDodajRestComponent]
    });
    fixture = TestBed.createComponent(AdminDodajRestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
