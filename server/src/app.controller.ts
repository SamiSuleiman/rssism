import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getRssUrl(@Query('url') url: string): Promise<{ url: string }> {
    return { url: await this.appService.getRssUrl(url) };
  }
}
