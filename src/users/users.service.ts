import { CreateUserDto } from "./dto/create-user.dto";
import { Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}
  create(createUserDto: CreateUserDto) {
    return `This action adds a new user ${createUserDto}`;
  }

  async findAll() {
    const users = await this.usersRepository.find();
    // const users = await this.dataSource.getRepository(User).createQueryBuilder("user").getMany();

    console.log("users", users);
    return users;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({
      id,
    });
    console.log("user", user);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersRepository.update(id, updateUserDto);
    return updatedUser;
  }

  async remove(id: string) {
    await this.usersRepository.delete(id);
  }
}
