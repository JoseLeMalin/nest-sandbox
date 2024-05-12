import { Test, TestingModule } from '@nestjs/testing';
import { QuerybuildersController } from './querybuilders.controller';
import { QuerybuildersService } from './querybuilders.service';

describe('QuerybuildersController', () => {
  let controller: QuerybuildersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuerybuildersController],
      providers: [QuerybuildersService],
    }).compile();

    controller = module.get<QuerybuildersController>(QuerybuildersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
