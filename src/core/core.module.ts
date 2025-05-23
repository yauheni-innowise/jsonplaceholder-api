import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { HealthController } from './controllers/health.controller';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { GlobalAuthGuard } from './guards/global-auth.guard';

/**
 * Core module for application-wide concerns like exception handling,
 * guards, and interceptors
 */
@Module({
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class CoreModule implements NestModule {
  /**
   * Configure middleware to apply to all routes
   * @param consumer - Middleware consumer
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
