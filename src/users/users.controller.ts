import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDtoInput } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";



@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDtoInput) {
    console.log("Controller createUserDto", createUserDto);

    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log("controller id", id);
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
