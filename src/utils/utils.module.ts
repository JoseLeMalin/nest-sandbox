import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UtilsController } from './utils.controller';
import { QuerybuildersModule } from './querybuilders/querybuilders.module';

@Module({
  controllers: [UtilsController],
  providers: [UtilsService],
  imports: [QuerybuildersModule],
})
export class UtilsModule {}
