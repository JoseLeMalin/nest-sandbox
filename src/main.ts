import { NestFactory } from "@nestjs/core";import { AppModule } from "./app.module";
import { getRedisClient } from "./config/redis.config";
import { loadAll } from "@utils/redis/rediscache.utils";
// eslint-disable-next-line @typescript-eslint/no-var-requires
//const NestFactory = require("@nestjs/core");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:4200",
  });
  // const theRedisConfigObj = await getRedisClient();

  // await theRedisConfigObj.flushAll();
  await loadAll();

  // theRedisConfigObj.quit();
  await app.listen(3000);
}
bootstrap();
