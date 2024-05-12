import { CreateItemDtoInput, CreateItemDtoOutput } from "src/items/dto/create-item.dto";import { CreateUserDtoInput, CreateUserDtoOutput } from "src/users/dto/create-user.dto";
import { UpdateItem } from "src/items/entities/item.entity";
import { UpdateUser } from "src/users/entities/user.entity";

export type DbCreateModels = CreateUserDtoInput | CreateItemDtoInput;
export type DbUpdateModels = UpdateUser | UpdateItem;
export type DbModels = CreateUserDtoOutput | CreateItemDtoOutput;


export type DbModelsBis = CreateUserDtoOutput | CreateItemDtoOutput;
