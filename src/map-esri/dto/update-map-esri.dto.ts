import { PartialType } from '@nestjs/mapped-types';
import { CreateMapEsriDto } from './create-map-esri.dto';

export class UpdateMapEsriDto extends PartialType(CreateMapEsriDto) {}
