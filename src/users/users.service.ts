import { CreateUserDtoInput } from "./dto/create-user.dto";
import { Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DataSource, Repository } from "typeorm";
import { v4 } from "uuid";
import * as dayjs from "dayjs";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  findAll() {
    const users = this.usersRepository.find();
    // const users = await this.dataSource.getRepository(User).createQueryBuilder("user").getMany();

    console.log("users", users);
    return users;
  }

  findOne(id: string) {
    const user = this.usersRepository.findOneBy({
      id,
    });
    console.log("user", user);

    return user;
  }
  create(createUserDto: CreateUserDtoInput) {
    try {
      const id = v4();
      const newUser = {
        ...createUserDto,
        id,
        createdAt: dayjs().toDate(),
        updatedAt: dayjs().toDate(),
      };
      console.log("testUser", newUser, id);

      const insertResult = this.usersRepository.insert(newUser);
      console.log("insertResult", insertResult);
      return newUser;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    try {
      console.log("updateUserDto", updateUserDto);

      const updatedUser = this.usersRepository.update(id, updateUserDto);
      return updatedUser;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }

  async remove(id: string) {
    await this.usersRepository.delete(id);
  }
}
