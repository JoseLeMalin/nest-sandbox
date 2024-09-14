import { Injectable } from "@nestjs/common";import { CreateMapEsriDto } from "./dto/create-map-esri.dto";
import { UpdateMapEsriDto } from "./dto/update-map-esri.dto";

@Injectable()
export class MapEsriService {
  create(createMapEsriDto: CreateMapEsriDto) {
    return "This action adds a new mapEsri";
  }

  findAll() {
    console.log("In the findall map esri:");

    return process.env.ESRI_API_KEY;
    // return { apiKey: process.env.ESRI_API_KEY };
  }
  getEsriApiKey() {
    return process.env.ESRI_API_KEY;
  }

  findOne(id: number) {
    return `This action returns a #${id} mapEsri`;
  }

  update(id: number, updateMapEsriDto: UpdateMapEsriDto) {
    return `This action updates a #${id} mapEsri`;
  }

  remove(id: number) {
    return `This action removes a #${id} mapEsri`;
  }
}
