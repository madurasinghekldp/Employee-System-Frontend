import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SalaryService } from './salary.service';

describe('SalaryService', () => {
  let service: SalaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SalaryService],
    });
    service = TestBed.inject(SalaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
