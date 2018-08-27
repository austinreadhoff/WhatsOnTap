import { TestBed, inject } from '@angular/core/testing';

import { TapService } from './tap.service';

describe('TapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TapService]
    });
  });

  it('should be created', inject([TapService], (service: TapService) => {
    expect(service).toBeTruthy();
  }));
});
