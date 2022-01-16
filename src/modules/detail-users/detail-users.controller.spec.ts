import { Test, TestingModule } from '@nestjs/testing';
import { DetailUsersController } from './detail-users.controller';

describe('DetailUsersController', () => {
  let controller: DetailUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailUsersController],
    }).compile();

    controller = module.get<DetailUsersController>(DetailUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
