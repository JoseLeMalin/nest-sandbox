import { Module } from '@nestjs/common';
import { MapEsriService } from './map-esri.service';
import { MapEsriController } from './map-esri.controller';

@Module({
  controllers: [MapEsriController],
  providers: [MapEsriService],
})
export class MapEsriModule {}
