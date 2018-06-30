import { TestBed, inject } from '@angular/core/testing';

import { GetQuestionsService } from './get-questions.service';

describe('GetQuestionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetQuestionsService]
    });
  });

  it('should be created', inject([GetQuestionsService], (service: GetQuestionsService) => {
    expect(service).toBeTruthy();
  }));
});
