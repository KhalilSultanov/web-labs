import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {UpdateProductDto} from "./dto/update-product.dto";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {CacheStore} from "@nestjs/common/cache";

@Injectable()
export class ProductsService {
    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    ) {
    }


    async findAll() {
        const cacheKey = 'products:all';

        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            console.log('📦 Получено из кэша');
            return cached;
        }

        console.log('🔥 findAll вызван');
        const products = await this.prisma.product.findMany({
            orderBy: {id: 'asc'},
        });

        await this.cacheManager.set(cacheKey, products, { ttl: 30 }); // TTL в секундах
        console.log('💾 Сохранено в кэш');
        return products;
    }


    async create(data: {
        name: string;
        manufacturer: string;
        price: number;
        categoryId: number;
        image?: string;
    }) {
        const created = await this.prisma.product.create({
            data: {
                name: data.name,
                manufacturer: data.manufacturer,
                price: data.price,
                categoryId: data.categoryId,
                image: data.image ?? '',
            },
        });

        await this.cacheManager.del!('products:all');
        console.log('♻️ Кэш очищен после создания');

        return created;
    }


    getAllCategories() {
        return this.prisma.category.findMany();
    }

    getAllManufacturers() {
        return this.prisma.product.findMany({
            distinct: ['manufacturer'],
            select: {manufacturer: true},
        });
    }

    async update(id: number, dto: UpdateProductDto) {
        const data = Object.fromEntries(
            Object.entries(dto).filter(([, v]) => v !== undefined),
        );

        const updated = await this.prisma.product.update({
            where: {id},
            data,
        });

        await this.cacheManager.del!('products:all');
        console.log('♻️ Кэш очищен после обновления');

        return updated;
    }


    async delete(id: number) {
        const deleted = await this.prisma.product.delete({where: {id}});

        await this.cacheManager.del!('products:all');
        console.log('♻️ Кэш очищен после удаления');

        return deleted;
    }


    async findById(id: number) {
        return this.prisma.product.findUnique({
            where: {id},
        });
    }

    async findPaginated({page, limit}: { page: number; limit: number }) {
        const skip = (page - 1) * limit;

        const [data, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                skip,
                take: limit,
                orderBy: {id: 'asc'},
            }),
            this.prisma.product.count(),
        ]);

        return {data, total};
    }

    async findByIdOrThrow(id: number) {
        const product = await this.prisma.product.findUnique({where: {id}});
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async getCategory(id: number) {
        return this.prisma.category.findUnique({where: {id}});
    }

}
