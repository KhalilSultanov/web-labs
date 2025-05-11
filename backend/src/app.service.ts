import {Injectable} from '@nestjs/common';
import {PrismaService} from './prisma/prisma.service';

@Injectable()
export class AppService {
    constructor(private prisma: PrismaService) {
    }

    async getPopularProducts() {
        return this.prisma.product.findMany({
            take: 6,
        });
    }

    async getAllBrands(): Promise<string[]> {
        const products = await this.prisma.product.findMany({
            select: {manufacturer: true},
            distinct: ['manufacturer'],
        });
        return products.map((p) => p.manufacturer);
    }
}
