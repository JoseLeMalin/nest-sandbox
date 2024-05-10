import { PartialType } from "@nestjs/mapped-types";
import { Role, User } from "../entities/user.entity";

export class UpdateUserDto extends PartialType(User) {
  id: string;
  constructor(
    id: string,
    name: string,
    email: string,
    createdAt: string,
    updatedAt: string,
    role: Role,
    password?: string,
  ) {
    super(name, email, createdAt, updatedAt, role, password);
    this.id = id;
    //   this.id = id;
    //   this.name = name;
    //   this.email = email;
    //   this.password = password;
    //   this.createdAt = createdAt;
    //   this.updatedAt = updatedAt;
    //   this.role = role;
  }
}
