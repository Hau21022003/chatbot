import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isRaw = this.reflector.get<boolean>(
      'IS_RAW_RESPONSE',
      context.getHandler(),
    );
    if (isRaw) {
      return next.handle(); // không format
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => ({
        status: data?.status || 'success',
        message: data?.message || 'Thành công',
        data: data?.data ?? data,
        meta: {
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      })),
    );
  }
}
