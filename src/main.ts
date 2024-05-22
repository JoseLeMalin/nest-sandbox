import { NestFactory } from "@nestjs/core";import { AppModule } from "./app.module";
import { redisClient } from "./config/redis.config";
import { loadAll } from "@utils/redis/rediscache.utils";
// eslint-disable-next-line @typescript-eslint/no-var-requires
//const NestFactory = require("@nestjs/core");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:4200",
  });
  console.log("avant redis");

  const theRedisConfigObj = (await redisClient()).redisClient;
  console.log("theRedisConfigObj", theRedisConfigObj);
  console.log("Load users in main");
  await theRedisConfigObj.flushAll();
  await loadAll();
  console.log("après redis");
  console.log(await theRedisConfigObj.keys("*"));
  theRedisConfigObj.quit();
  await app.listen(3000);
}
bootstrap();
