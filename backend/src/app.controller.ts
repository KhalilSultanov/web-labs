import {Controller, Get, Query, Render} from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    @Render('index')
    getHome(@Query('auth') auth: string) {
        const user = auth === '1' ? 'Иван' : null;

        const brands = Array(12).fill('ВАЗ');

        const popular = Array(6).fill(null).map(() => ({
            name: 'Кардан',
            manufacturer: 'Россия',
            price: '1500р',
            img: '/img/cardan.jpg',
        }));

        return {user, brands, popular};
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
            user: null, // или текущий пользователь, если есть
        };
    }

    @Get('/reviews')
    @Render('reviews')
    getReviewsPage() {
        return {
            title: 'Отзывы',
            user: null, // или 'Иван', если нужен авторизованный пользователь
        };
    }

    @Get('/contacts')
    @Render('contacts')
    getContactsPage() {
        return {
            title: 'Контакты',
            user: null, // или имя, если залогинен
        };
    }


}
