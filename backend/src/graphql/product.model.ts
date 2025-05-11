// src/products/graphql/product.model.ts
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class ProductModel {
    @Field(() => ID)
    id: number;

    @Field() name: string;
    @Field() manufacturer: string;
    @Field(() => Int) price: number;
    @Field(() => Int) categoryId: number;
    @Field({ nullable: true }) image?: string;
}
