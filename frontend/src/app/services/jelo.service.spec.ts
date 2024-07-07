import { TestBed } from '@angular/core/testing';

import { JeloService } from './jelo.service';

describe('JeloService', () => {
  let service: JeloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JeloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
