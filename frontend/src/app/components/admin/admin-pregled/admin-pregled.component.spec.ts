import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPregledComponent } from './admin-pregled.component';

describe('AdminPregledComponent', () => {
  let component: AdminPregledComponent;
  let fixture: ComponentFixture<AdminPregledComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPregledComponent]
    });
    fixture = TestBed.createComponent(AdminPregledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
