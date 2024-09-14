import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MapEsriService } from './map-esri.service';
import { CreateMapEsriDto } from './dto/create-map-esri.dto';
import { UpdateMapEsriDto } from './dto/update-map-esri.dto';

@Controller('map-esri')
export class MapEsriController {
  constructor(private readonly mapEsriService: MapEsriService) {}

  @Post()
  create(@Body() createMapEsriDto: CreateMapEsriDto) {
    return this.mapEsriService.create(createMapEsriDto);
  }

  @Get()
  findAll() {
    return this.mapEsriService.findAll();
  }
  // @Get()
  // getEsriApiKey() {
  //   return this.mapEsriService.getEsriApiKey();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mapEsriService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMapEsriDto: UpdateMapEsriDto) {
    return this.mapEsriService.update(+id, updateMapEsriDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mapEsriService.remove(+id);
  }
}
