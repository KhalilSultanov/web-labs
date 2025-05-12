import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import * as crypto from 'crypto';
import {NotModifiedException} from "../exceptions/not-modified.exception";

@Injectable()
export class EtagInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();

        return next.handle().pipe(
            map((body) => {
                const json = JSON.stringify(body);
                const etag = crypto.createHash('md5').update(json).digest('hex');

                if (req.headers['if-none-match'] === etag) {
                    throw new NotModifiedException(); // 304
                }

                if (!res.headersSent) {
                    res.setHeader('ETag', etag);
                }

                return body;
            }),
        );
    }
}
