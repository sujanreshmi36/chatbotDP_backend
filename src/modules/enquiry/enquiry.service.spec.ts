import { Test, TestingModule } from '@nestjs/testing';
import { EnquiryService } from './enquiry.service';

describe('EnquiryService', () => {
  let service: EnquiryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnquiryService],
    }).compile();

    service = module.get<EnquiryService>(EnquiryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
