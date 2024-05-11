import dayjs from "dayjs";
import { DataSource } from "typeorm";

/* export  const updateFormatter = async <T>(itemToUpdate:T) => {

    // const updatedUser = await dataSource
    //     .createQueryBuilder()
    //     .update<T>(itemToUpdate)
    //     .set(itemToUpdate)
    //     .where("id = :id", { id })
    //     .returning("*")
    //     .execute();
     //  console.log("updatedUser", updatedUser);
}  */

export class UpdateFormatter {
  constructor(private dataSource: DataSource) {}

  updateMetadata<T>(itemToUpdate: T) {
    return { ...itemToUpdate, updateAt: dayjs().toDate() };
  }

  // sendUpdateQuery<T>(itemToUpdate: T) {
  //   return this.dataSource
  //     .createQueryBuilder()
  //     .update(itemToUpdate)
  //     .set(itemToUpdate)
  //     .where("id = :id", { id: itemToUpdate.id })
  //     .returning("*")
  //     .execute();
  // }
}
