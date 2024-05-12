import { Injectable } from "@nestjs/common";
import { UpdateItemDto } from "./dto/update-item.dto";
import { CreateItemDtoInput } from "./dto/create-item.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "./entities/item.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private usersRepository: Repository<Item>,
    private dataSource: DataSource,
  ) {}
  create(createItemDto: CreateItemDtoInput) {
    console.log("createItemDto", createItemDto);
    return "This action adds a new item";
  }

  findAll() {
    return `This action returns all items`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    console.log("updateItemDto", updateItemDto);

    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
