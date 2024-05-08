import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
// eslint-disable-next-line @typescript-eslint/no-var-requires
//const NestFactory = require("@nestjs/core");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
