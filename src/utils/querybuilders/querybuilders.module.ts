import { Module } from '@nestjs/common';
import { QuerybuildersService } from './querybuilders.service';
import { QuerybuildersController } from './querybuilders.controller';

@Module({
  controllers: [QuerybuildersController],
  providers: [QuerybuildersService],
})
export class QuerybuildersModule {}
