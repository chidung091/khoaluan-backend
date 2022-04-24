import { Test, TestingModule } from '@nestjs/testing';
import { PointFrameService } from './point-frame.service';

describe('PointFrameService', () => {
  let service: PointFrameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointFrameService],
    }).compile();

    service = module.get<PointFrameService>(PointFrameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
