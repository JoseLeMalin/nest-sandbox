import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
export abstract class BasePGEntities {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({type: "timestamp without time zone"})
  createdAt: Date;
  @UpdateDateColumn({type: "timestamp without time zone"})
  updatedAt: Date;

  constructor({ id, createdAt, updatedAt }: BasePGEntities) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
