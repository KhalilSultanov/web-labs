import {Controller, Get, Query, Render} from '@nestjs/common';
import {AppService} from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    @Render('index')
    async getHome(@Query('auth') auth: string) {
        const user = auth === '1' ? 'Иван' : null;

        const brands = await this.appService.getAllBrands();
        const popular = await this.appService.getPopularProducts();

        console.log('Популярные товары:', popular); // <--- вот это важно!

        return { user, brands, popular };
    }



    @Get('/pay')
    @Render('pay')
    getPay() {
        return {user: null};
    }

    @Get('/delivery')
    @Render('delivery')
    getDeliveryPage() {
        return {
            title: 'Доставка',
            user: null,
        };
    }

    @Get('/reviews')
    @Render('reviews')
    getReviewsPage() {
        return {
            title: 'Отзывы',
            user: null,
        };
    }

    @Get('/contacts')
    @Render('contacts')
    getContactsPage() {
        return {
            title: 'Контакты',
            user: null,
        };
    }
}
