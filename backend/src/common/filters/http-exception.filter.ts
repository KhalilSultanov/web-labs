// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        const status = exception.getStatus();
        const response = exception.getResponse();

        res.status(status).json(
            typeof response === 'string' ? { message: response } : response,
        );
    }
}
