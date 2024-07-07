import { TestBed } from '@angular/core/testing';

import { DostavaService } from './dostava.service';

describe('DostavaService', () => {
  let service: DostavaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DostavaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
