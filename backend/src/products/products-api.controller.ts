import {
    Controller, Get, Post, Patch, Delete, Param, Body, Query, Res, HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { buildPaginationLinks } from '../common/pagination/generate-links.util';
import {
    ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse,
    ApiNotFoundResponse, ApiBadRequestResponse, ApiQuery,
} from '@nestjs/swagger';
import { ProductResponseDto } from './dto/product-response.dto';
import {PaginateQueryDto} from "../common/pagination/paginate-query.dto";

@ApiTags('Products')
@Controller('api/products')
export class ProductsApiController {
    constructor(private readonly productsService: ProductsService) {}

    // ───────── list ─────────
    @Get()
    @ApiOperation({ summary: 'Получить список продуктов (пагинация)' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 2 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
    @ApiOkResponse({ type: [ProductResponseDto] })
    async findAll(
        @Query() { page = 1, limit = 10 }: PaginateQueryDto,
        @Res() res: Response,
    ) {
        const { data, total } = await this.productsService.findPaginated({ page, limit });

        const link = buildPaginationLinks(
            `${res.req.protocol}://${res.req.get('host')}${res.req.baseUrl || '/api/products'}`,
            page, limit, total,
        );
        res.setHeader('Link', link);
        res.setHeader('X-Total-Count', total.toString());

        return res.json(data);
    }

    // ───────── single ─────────
    @Get(':id')
    @ApiOperation({ summary: 'Получить продукт по id' })
    @ApiOkResponse({ type: ProductResponseDto })
    @ApiNotFoundResponse({ description: 'Продукт не найден' })
    async findOne(@Param('id') id: string) {
        return this.productsService.findByIdOrThrow(+id);
    }

    // ───────── create ─────────
    @Post()
    @ApiOperation({ summary: 'Создать продукт' })
    @ApiCreatedResponse({ type: ProductResponseDto })
    @ApiBadRequestResponse()
    async create(@Body() dto: CreateProductDto) {
        return this.productsService.create(dto);
    }

    // ───────── update ─────────
    @Patch(':id')
    @ApiOperation({ summary: 'Изменить продукт' })
    @ApiOkResponse({ type: ProductResponseDto })
    @ApiNotFoundResponse()
    async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this.productsService.update(+id, dto);
    }

    // ───────── delete ─────────
    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Удалить продукт' })
    @ApiNotFoundResponse()
    async remove(@Param('id') id: string) {
        await this.productsService.delete(+id);
    }
}
