import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const ctx = context.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();

        return next.handle().pipe(
            map((data) => {
                const elapsed = Date.now() - now;
                console.log(`[${req.method}] ${req.url} - ${elapsed}ms`);

                // Не трогай заголовки, если уже был отправлен ответ
                if (!res.headersSent) {
                    res.setHeader('X-Elapsed-Time', `${elapsed}ms`);
                }

                // Добавим elapsedTime для шаблонов
                if (res.render && typeof data === 'object' && data !== null) {
                    return {
                        ...data,
                        elapsedTime: `${elapsed}ms`,
                    };
                }

                return data;
            }),
        );
    }
}
