import { Test, TestingModule } from '@nestjs/testing';
import { MapEsriService } from './map-esri.service';

describe('MapEsriService', () => {
  let service: MapEsriService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapEsriService],
    }).compile();

    service = module.get<MapEsriService>(MapEsriService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
