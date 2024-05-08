import { TypeOrmModule } from "@nestjs/typeorm";import { User } from "./users/entities/user.entity";
import { env } from "./lib/env.validation";

// console.log("env.POSTGRESDB_LOCAL_PORT", env.POSTGRESDB_LOCAL_PORT);

export const AppDataSource = TypeOrmModule.forRoot({
  type: "postgres",
  host: "localhost",
  url: env.DATABASE_URL,
  port: env.POSTGRESDB_LOCAL_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  synchronize: env.POSTGRES_SYNCHRONIZE === "true" ? true : false,
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
  entitySkipConstructor: true,
});

// AppDataSource.initialize()
//   .then(() => {
//     // here you can start to work with your database
//   })
//   .catch((error) => console.log(error));
