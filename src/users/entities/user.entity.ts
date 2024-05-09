import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
export enum Role {
  ADMIN = "admin",
  EDITOR = "editor",
  READER = "reader",
  USER = "user",
  GHOST = "ghost",
}

@Entity({
  name: "User",
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column("timestamp without time zone")
  createdAt: Date;
  @Column("timestamp without time zone")
  updatedAt: Date;
  @Column("text")
  name: string;
  @Column("text")
  email: string;
  @Column("text")
  password: string;
  @Column({
    type: "enum",
    enum: Role,
    default: Role.READER,
  })
  role: Role.READER;

  // Set a constructor, avoiding TS errors
  constructor({ id, createdAt, name, updatedAt, email, password, role }: User) {
    super();
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
