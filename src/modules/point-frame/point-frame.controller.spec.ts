import { Test, TestingModule } from '@nestjs/testing';
import { PointFrameController } from './point-frame.controller';

describe('PointFrameController', () => {
  let controller: PointFrameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointFrameController],
    }).compile();

    controller = module.get<PointFrameController>(PointFrameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
