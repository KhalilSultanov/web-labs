import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {UpdateProductDto} from "./dto/update-product.dto";


@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {
    }

    findAll() {
        return this.prisma.product.findMany({
            orderBy: {
                id: 'asc',
            },
        });
    }

    async create(data: {
        name: string;
        manufacturer: string;
        price: number;
        categoryId: number;
        image?: string;
    }) {
        return this.prisma.product.create({
            data: {
                name: data.name,
                manufacturer: data.manufacturer,
                price: data.price,
                categoryId: data.categoryId,
                image: data.image ?? '',
            },
        });
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
        // удаляем undefined‑поля,
        // чтобы не перезаписать их в БД
        const data = Object.fromEntries(
            Object.entries(dto).filter(([, v]) => v !== undefined),
        ) as Prisma.ProductUpdateInput;

        return this.prisma.product.update({
            where: {id},
            data,
        });
    }

    async delete(id: number) {
        return this.prisma.product.delete({where: {id}});
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

}
