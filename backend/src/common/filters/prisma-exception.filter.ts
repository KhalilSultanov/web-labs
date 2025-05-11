// src/common/filters/prisma-exception.filter.ts
import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus} from '@nestjs/common';
import {Response} from 'express';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        if (exception.code === 'P2025') {
            return res.status(HttpStatus.NOT_FOUND).json({message: 'Resource not found'});
        }

        return res.status(HttpStatus.BAD_REQUEST).json({
            message: `Database error: ${exception.message}`,
            code: exception.code,
        });
    }
}
