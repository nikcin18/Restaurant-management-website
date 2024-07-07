import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGostComponent } from './admin-gost.component';

describe('AdminGostComponent', () => {
  let component: AdminGostComponent;
  let fixture: ComponentFixture<AdminGostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminGostComponent]
    });
    fixture = TestBed.createComponent(AdminGostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
