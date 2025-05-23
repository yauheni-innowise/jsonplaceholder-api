import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';

/**
 * Controller for health check endpoints
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  /**
   * Basic health check endpoint
   * @returns Health status information
   */
  @ApiOperation({ summary: 'Health check', description: 'Returns the current health status of the API' })
  @ApiResponse({ 
    status: 200, 
    description: 'API is healthy', 
    schema: { 
      properties: { 
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2025-05-23T12:00:00.000Z' } 
      } 
    } 
  })
  @Public()
  @Get()
  checkHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Smoke test endpoint for testing
   * @returns Test message
   */
  @ApiOperation({ summary: 'Test endpoint', description: 'Simple test endpoint to verify Health API is working' })
  @ApiResponse({ 
    status: 200, 
    description: 'API is working', 
    schema: { 
      properties: { 
        message: { type: 'string', example: 'Health API is working!' } 
      } 
    } 
  })
  @Public()
  @Get('admin/test')
  test(): { message: string } {
    return { message: 'Health API is working!' };
  }
}
