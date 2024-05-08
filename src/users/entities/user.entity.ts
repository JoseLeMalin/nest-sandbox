import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  READER = "reader",
  GHOST = "ghost",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: number;
  @Column("timestamp with local time zone")
  createdAt: Date;
  @Column("timestamp with local time zone")
  updatedAt: Date;
  @Column("string")
  name: string;
  @Column("text")
  email: string;
  @Column("text")
  password: string;
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.READER,
  })
  role: UserRole.READER;

  // Set a constructor, avoiding TS errors
  constructor({ id, createdAt, name, updatedAt, email, password, role }: User) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
