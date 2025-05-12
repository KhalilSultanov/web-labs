import {
    Controller,
    Get,
    Post,
    Render,
    Req,
    Res,
    UploadedFile,
    UseInterceptors,
    Sse, BadRequestException, Header,
} from '@nestjs/common';
import {Request, Response} from 'express';
import {ProductsService} from './products.service';
import {Observable, Subject, tap} from 'rxjs';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage, memoryStorage} from 'multer';
import {Param} from '@nestjs/common'; // обязательно!
import {MessageEvent} from '@nestjs/common';
import {ApiExcludeController} from '@nestjs/swagger';
import {EtagInterceptor} from "../common/interceptors/etag.interceptor";
import {StorageService} from "../storage/storage.service";

function sseEvent(type: string, data: any): MessageEvent {
    return {
        type,
        data,
    };
}

@ApiExcludeController()
@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly storageService: StorageService, // 👈 добавили
    ) {
    }

    private productStream = new Subject<any>();

    @UseInterceptors(EtagInterceptor)
    @Get()
    @Header('Cache-Control', 'public, max-age=3600')
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
        storage: memoryStorage(),
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
            const imageUrl = await this.storageService.upload(
                file.buffer,
                file.originalname,
                file.mimetype,
            );
            data.image = imageUrl;
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
            storage: memoryStorage(),
        }),
    )
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
        @Res() res: Response,
    ) {

        const imageUrl = file
            ? await this.storageService.upload(file.buffer, file.originalname, file.mimetype)
            : '';


        const product = {
            name: String(req.body.name),
            manufacturer: String(req.body.manufacturer),
            price: Number(req.body.price),
            categoryId: Number(req.body.categoryId),
            image: imageUrl,
        };


        const created = await this.productsService.create(product);

        this.productStream.next(sseEvent('new-product', created));

        return res.redirect('/products');
    }


    @Sse('events')
    streamProducts(): Observable<MessageEvent> {

        return this.productStream.asObservable().pipe(
            tap(event => {
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
