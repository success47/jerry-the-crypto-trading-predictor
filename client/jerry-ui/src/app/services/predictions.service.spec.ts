import { TestBed } from '@angular/core/testing';

import { PredictionService } from '../services/predictions.service';

describe('PredictionsService', () => {
  let service: PredictionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredictionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
