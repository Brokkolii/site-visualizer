import { TestBed } from '@angular/core/testing';

import { ThreejsService } from './three-js.service';

describe('ThreeJsService', () => {
  let service: ThreejsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreejsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
