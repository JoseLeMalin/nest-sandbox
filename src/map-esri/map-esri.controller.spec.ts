import { Test, TestingModule } from '@nestjs/testing';
import { MapEsriController } from './map-esri.controller';
import { MapEsriService } from './map-esri.service';

describe('MapEsriController', () => {
  let controller: MapEsriController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapEsriController],
      providers: [MapEsriService],
    }).compile();

    controller = module.get<MapEsriController>(MapEsriController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
