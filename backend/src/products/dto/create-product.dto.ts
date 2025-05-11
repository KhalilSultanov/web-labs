import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'iPhone 16 Pro' })
    @IsString() @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Apple' })
    @IsString() @IsNotEmpty()
    manufacturer: string;

    @ApiProperty({ example: 1999, minimum: 0 })
    @IsNumber() @IsPositive()
    price: number;

    @ApiProperty({ example: 3 })
    @IsNumber()
    categoryId: number;

    @ApiProperty({ example: '/uploads/xyz.jpg', required: false })
    @IsString() @IsOptional()
    image?: string;
}
