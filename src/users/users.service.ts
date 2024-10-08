import { CreateUserDtoInput } from "./dto/create-user.dto";import { Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DataSource, Repository } from "typeorm";
import { v4 } from "uuid";
import { QuerybuildersService } from "src/utils/querybuilders/querybuilders.service";
import { redisClient } from "src/config/redis.config";
import { getOrSetCache } from "@utils/redis/rediscache.utils";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
    private queryBuilder: QuerybuildersService,
  ) {}

  async findAll(): Promise<User[]> {
    const client = (await redisClient()).redisClient;

    // await client.setEx("foo", 3600, "bar");
    const resultGetSet = await getOrSetCache("foo", async () => {
      return new Promise((resolve, reject) => {
        client
          .setEx(
            "foo",
            3600,
            JSON.stringify({
              id: 1,
            }),
          )
          .catch((error) => {
            console.log("error", error);
            return reject(error);
          });
        resolve({
          id: 1,
        });
      });
    });
    console.log("await client.get('foo')", await client.get("foo"));

    
    client.quit();
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
  async create(createUserDto: CreateUserDtoInput) {
    try {
      const id = v4();
      const newUser = {
        ...createUserDto,
        id,
        // createdAt: dayjs().toDate(),
        // updatedAt: dayjs().toDate(),
      };
      console.log("testUser", newUser, id);
      // const result = await this.createFormatter.createSingleEntity(newUser, User);
      const result = await this.queryBuilder.createSingleEntity(newUser, User);

      // const result = [""];
      console.log("result query create", result);
      // const insertResult = this.dataSource
      //   .createQueryBuilder()
      //   .update(User)
      //   .set(newUser)
      //   .returning("*")
      //   .execute();
      // console.log("insertResult", insertResult);
      // // const insertResult = this.usersRepository.insert(newUser);
      // console.log("insertResult", insertResult);
      return result;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      console.log("updateUserDto", updateUserDto);
      // const userFormated = [""];
      const resultUpdate = await this.queryBuilder.updateSingleEntity<UpdateUserDto>(
        updateUserDto,
        User,
      );
      console.log("userFormated: ", resultUpdate);

      // const updatedUser = await this.dataSource
      //   .createQueryBuilder()
      //   .update<User>(User)
      //   .set(updateUserDto)
      //   .where("id = :id", { id })
      //   .returning("*")
      //   .execute();
      // console.log("updatedUser", updatedUser);

      return;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }

  async remove(id: string) {
    const result = await this.queryBuilder.remove(id, User);
    return result;
    // await this.usersRepository.delete(id);
  }
}
