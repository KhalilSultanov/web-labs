// src/common/filters/prisma-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        // code 'P2025' = record not found
        if (exception.code === 'P2025') {
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'Resource not found' });
        }

        // общее Prisma‑исключение
        return res.status(HttpStatus.BAD_REQUEST).json({
            message: `Database error: ${exception.message}`,
            code: exception.code,
        });
    }
}
