import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Pool } from "pg";

@Injectable()
export class UsersService {
  private pool = new Pool();
  private readonly users = [
    {
      userId: 1,
      username: "john",
      password: "changeme",
    },
    {
      userId: 2,
      username: "maria",
      password: "guess",
    },
  ];
  async create(createUserDto: CreateUserDto) {
    const client = await this.pool.connect();
    try {
      const newUser = client.query<{ username: string; email: string; full_name: string }>(
        "INSERT INTO users(username, password, email, full_name) VALUES($1, $2, $3, $4) RETURNING *",
        [
          createUserDto.username,
          createUserDto.password,
          createUserDto.email,
          createUserDto.fullName,
        ],
      );
      return newUser;
    } finally {
      client.release();
    }
  }

  async findAll() {
    const client = await this.pool.connect();
    try {
      const res = await client.query<{ username: string; email: string; full_name: string }>(
        "SELECT username, email, full_name FROM users",
      );
      return res.rows;
    } finally {
      client.release();
    }
  }

  async findOne(id: number) {
    const client = await this.pool.connect();
    try {
      const res = await client.query<{ username: string; email: string; full_name: string }>(
        "SELECT username, email, full_name FROM users WHERE user_id = $1",
        [id],
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  }
  async findOneByUsername(username: string) {
    const client = await this.pool.connect();
    try {
      const res = await client.query<{ userId: number; username: string; password: string }>(
        "SELECT user_id, username, password FROM users WHERE username = $1",
        [username],
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
