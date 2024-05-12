import { Test, TestingModule } from '@nestjs/testing';
import { QuerybuildersService } from './querybuilders.service';

describe('QuerybuildersService', () => {
  let service: QuerybuildersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuerybuildersService],
    }).compile();

    service = module.get<QuerybuildersService>(QuerybuildersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
