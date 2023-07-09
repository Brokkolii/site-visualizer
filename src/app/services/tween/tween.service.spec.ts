import { TestBed } from '@angular/core/testing';

import { TweenService } from './tween.service';

describe('TweenService', () => {
  let service: TweenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TweenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
