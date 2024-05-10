import { Role } from "../entities/user.entity";

export class CreateUserDtoInput {
  // id: string;
  name: string;
  email: string;
  password: string;
  // createdAt: string;
  // updatedAt: string;
  role: Role;

  constructor(
    // id: string,
    name: string,
    email: string,
    password: string,
    role: Role,
    // createdAt: string,
    // updatedAt: string,
  ) {
    // this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    // this.createdAt = createdAt;
    // this.updatedAt = updatedAt;
    this.role = role;
  }
}

export class CreateUserDtoOutput {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
  role: Role;

  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    role: Role,
    createdAt: string,
    updatedAt: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.role = role;
  }
}
