import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, IsInt, IsOptional } from 'class-validator';

@InputType()
export class CreateProductInput {
    @Field() @IsNotEmpty() name: string;
    @Field() @IsNotEmpty() manufacturer: string;
    @Field(() => Int) @IsPositive() price: number;
    @Field(() => Int) @IsInt() categoryId: number;
    @Field({ nullable: true }) @IsOptional() image?: string;
}
