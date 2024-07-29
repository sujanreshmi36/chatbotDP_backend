import { Test, TestingModule } from '@nestjs/testing';
import { EnquiryController } from './enquiry.controller';
import { EnquiryService } from './enquiry.service';

describe('EnquiryController', () => {
  let controller: EnquiryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnquiryController],
      providers: [EnquiryService],
    }).compile();

    controller = module.get<EnquiryController>(EnquiryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
