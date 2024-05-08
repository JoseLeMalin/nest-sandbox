import {  Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: number;
  // @Column()
  // createdAt: Date | undefined;
  // @Column()
  // name: string | undefined;
  // @Column()
  // description: string | undefined;
  // @Column()
  // filename: string | undefined;
  // @Column()
  // views: number | undefined;
  // @Column()
  // isPublished: boolean | undefined;
}
