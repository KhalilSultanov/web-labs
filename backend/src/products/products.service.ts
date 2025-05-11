import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';


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

    async update(id: number, data: {
        name: string;
        manufacturer: string;
        price: number;
        categoryId: number;
        image?: string;
    }) {
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


}
