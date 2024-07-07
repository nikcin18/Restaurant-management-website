import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRadnoVremeComponent } from './admin-radno-vreme.component';

describe('AdminRadnoVremeComponent', () => {
  let component: AdminRadnoVremeComponent;
  let fixture: ComponentFixture<AdminRadnoVremeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRadnoVremeComponent]
    });
    fixture = TestBed.createComponent(AdminRadnoVremeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
