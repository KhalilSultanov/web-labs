// src/products/graphql/product-page.model.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ProductModel } from './product.model';

@ObjectType()
export class ProductPage {
    @Field(() => [ProductModel]) data: ProductModel[];
    @Field(() => Int) total: number;
}
