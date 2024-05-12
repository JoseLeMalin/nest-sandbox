import { Item } from "src/items/entities/item.entity";
import { DbCreateModels, DbUpdateModels } from "src/types/entities/generics.entities";
import * as dayjs from "dayjs";
import { User } from "src/users/entities/user.entity";
import { DataSource, EntityMetadata, EntityTarget } from "typeorm";

export class CreateClass {
  private entitiesList!: Map<EntityTarget<any>, EntityMetadata>;
  constructor(private dataSource: DataSource) {
    // this.entitiesList = this.dataSourc e.entityMetadatasMap;
    // console.log("this.entitiesList.values()", this.entitiesList.values());
  }

  async createSingleEntity<T extends DbCreateModels>(
    itemToCreate: T,
    entityTarget: EntityTarget<User | Item>,
  ) {
    const formattedInput: T = { ...itemToCreate, createdAt: dayjs().toDate() };
    const createdItem = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(entityTarget)
      .values(formattedInput)
      .returning("*")
      .execute();
    console.log("createdItem", createdItem);
    return createdItem;
  }
  async createBulkEntity<T extends DbCreateModels>(itemToCreate: T[]) {
    const formattedInputs = itemToCreate.map((item) => ({ ...item, createdAt: dayjs().toDate() }));
    const createdItems = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(formattedInputs)
      .returning("*")
      .execute();
    console.log("createdItems", createdItems);
    return createdItems;
  }
}

export class UpdateClass {
  constructor(private dataSource: DataSource) {}

  async updateSingleEntity<T extends DbUpdateModels>(
    itemToUpdate: T,
    entityTarget: EntityTarget<T>,
  ) {
    return await this.dataSource
      .createQueryBuilder()
      .update(entityTarget)
      .set({ ...itemToUpdate, updatedAt: dayjs().toDate() })
      .where("id = :id", { id: itemToUpdate.id })
      .returning("*")
      .execute();
  }
}
