import { Controller } from '@nestjs/common';
import { QuerybuildersService } from './querybuilders.service';

@Controller()
export class QuerybuildersController {
  constructor(private readonly querybuildersService: QuerybuildersService) {}
}
