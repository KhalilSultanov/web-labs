// src/products/dto/product-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
    @ApiProperty() id: number;
    @ApiProperty() name: string;
    @ApiProperty() manufacturer: string;
    @ApiProperty() price: number;
    @ApiProperty() categoryId: number;
    @ApiProperty() image: string | null;
}
