import {
    Controller,
    Get,
    Post,
    Render,
    Req,
    Res,
    UploadedFile,
    UseInterceptors,
    Sse, BadRequestException,
} from '@nestjs/common';
import {Request, Response} from 'express';
import {ProductsService} from './products.service';
import {Observable, Subject, tap} from 'rxjs';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {extname} from 'path';
import {Param} from '@nestjs/common'; // обязательно!
import {MessageEvent} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

function sseEvent(type: string, data: any): MessageEvent {
    return {
        type,
        data,
    };
}

@ApiExcludeController()
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {
    }

    private productStream = new Subject<any>();

    @Get()
    @Render('products/products')
    async getAll() {
        const products = await this.productsService.findAll();
        return {products};
    }


    @Get('add')
    @Render('products/add')
    async getAddForm() {
        const categories = await this.productsService.getAllCategories();
        const manufacturers = await this.productsService.getAllManufacturers();
        return {categories, manufacturers};
    }


    @Post(':id/edit')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './public/uploads',
            filename: (req, file, cb) => {
                const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, unique + extname(file.originalname));
            },
        }),
    }))
    async updateProduct(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const data: any = {
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            price: Number(req.body.price),
            categoryId: Number(req.body.categoryId),
        };

        if (file) {
            data.image = `/uploads/${file.filename}`;
        }

        await this.productsService.update(Number(id), data);
        res.redirect(`/products/${id}`);
    }

    @Post(':id/delete')
    async deleteProduct(@Param('id') id: string, @Res() res: Response) {
        await this.productsService.delete(Number(id));
        res.redirect('/products');
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './public/uploads',
                filename: (req, file, cb) => {
                    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, unique + extname(file.originalname));
                },
            }),
        }),
    )
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const product = {
            name: String(req.body.name),
            manufacturer: String(req.body.manufacturer),
            price: Number(req.body.price),
            categoryId: Number(req.body.categoryId),
            image: file ? `/uploads/${file.filename}` : '',
        };

        console.log('📦 FINAL PRODUCT DATA:', product);

        const created = await this.productsService.create(product);

        this.productStream.next(sseEvent('new-product', created));

        return res.redirect('/products');
    }


    @Sse('events')
    streamProducts(): Observable<MessageEvent> {
        console.log('📡 SSE соединение установлено /products/events');

        return this.productStream.asObservable().pipe(
            tap(event => {
                console.log('📤 Отправка SSE события:', event);
            })
        );
    }

    @Get(':id')
    @Render('products/item')
    async getOne(@Param('id') id: string) {
        const productId = Number(id);
        if (isNaN(productId)) throw new BadRequestException('Некорректный ID');

        const product = await this.productsService.findById(productId);
        const categories = await this.productsService.getAllCategories();
        const manufacturers = await this.productsService.getAllManufacturers();

        return {product, categories, manufacturers};
    }


}
