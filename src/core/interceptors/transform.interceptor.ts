import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interface for the standardized API response
 */
export interface Response<T> {
  data: T;
  meta: {
    timestamp: string;
    status: number;
  };
}

/**
 * Interceptor to transform the response data to a standardized format
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  /**
   * Intercept the response and transform it to a standardized format
   * @param context - Execution context
   * @param next - Call handler
   * @returns Observable with transformed response
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    
    return next.handle().pipe(
      map((data) => ({
        data,
        meta: {
          timestamp: new Date().toISOString(),
          status: response.statusCode,
        },
      })),
    );
  }
}
