import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for logging HTTP requests
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  /**
   * Log the HTTP request and measure response time
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const responseTime = Date.now() - startTime;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength ? contentLength + 'b' : '-'} ${responseTime}ms - ${userAgent}`,
      );
    });

    next();
  }
}
