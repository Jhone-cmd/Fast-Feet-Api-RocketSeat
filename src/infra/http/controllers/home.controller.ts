import { Controller, Get, Redirect } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'

@Controller('/')
@ApiExcludeController()
export class HomeController {
  constructor() {}

  @Get()
  @Redirect('/api/docs', 301)
  async handle() {}
}
