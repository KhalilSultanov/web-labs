import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {join} from 'path';
import * as hbs from 'hbs';
import * as express from 'express';

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

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    hbs.registerHelper('eq', (a, b) => a === b);

    // Порт из переменной окружения или 3000 по умолчанию
    const port = process.env.PORT || 3000;
    await app.listen(port);
}

bootstrap();
