import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller('/')
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Check application health' })
  @ApiResponse({
    status: 200,
    description: 'The application is healthy',
    schema: { example: { status: 'ok' } },
  })
  getHealth() {
    return { status: 'ok' };
  }
}
