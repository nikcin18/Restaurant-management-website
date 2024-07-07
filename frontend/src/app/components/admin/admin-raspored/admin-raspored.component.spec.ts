import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRasporedComponent } from './admin-raspored.component';

describe('AdminRasporedComponent', () => {
  let component: AdminRasporedComponent;
  let fixture: ComponentFixture<AdminRasporedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRasporedComponent]
    });
    fixture = TestBed.createComponent(AdminRasporedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
