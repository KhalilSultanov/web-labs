import {AppModule} from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {join} from 'path';
import * as hbs from 'hbs';
import * as express from 'express';
import {ValidationPipe} from "@nestjs/common";
import {HttpExceptionFilter} from "./common/filters/http-exception.filter";
import {PrismaExceptionFilter} from "./common/filters/prisma-exception.filter";
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {NestFactory} from "@nestjs/core";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Папка для представлений (views)
    app.setBaseViewsDir(join(__dirname, '..', 'views'));

    // Шаблонизатор Handlebars
    app.setViewEngine('hbs');

    // Подключение partials (общих блоков)
    hbs.registerPartials(join(__dirname, '..', 'views/partials'));

    app.set('view options', {
        layout: 'layout',
    });


    // Отдача статики из папки public (css, js, html)
    app.useStaticAssets(join(__dirname, '..', 'public'));

    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    hbs.registerHelper('eq', (a, b) => a === b);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,          // лишние поля будут вырезаны
            forbidNonWhitelisted: true,
            transform: true,          // строка → число и т.д.
        }),
    );
    app.useGlobalFilters(
        new HttpExceptionFilter(),
        new PrismaExceptionFilter(),
    );

    const config = new DocumentBuilder()
        .setTitle('Shop API')
        .setDescription('Документация REST API лабораторной работы 4')
        .setVersion('1.0')
        .addTag('Products', 'Операции с товарами')
        .build();


    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    // Порт из переменной окружения или 3000 по умолчанию
    const port = process.env.PORT || 3000;
    await app.listen(port);
}

bootstrap();
