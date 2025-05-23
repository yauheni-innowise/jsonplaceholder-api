import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global HTTP exception filter that handles all exceptions
 * and returns a standardized response format
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof errorResponse === 'object' && 'message' in errorResponse ? errorResponse.message : exception.message || 'Internal server error',
    };

    this.logger.error(
      `${request.method} ${request.url} ${status}`,
      exception.stack,
      HttpExceptionFilter.name,
    );

    response.status(status).json(responseBody);
  }
}
