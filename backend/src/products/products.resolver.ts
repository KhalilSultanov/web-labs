// src/products/products.resolver.ts
import {
    Resolver, Query, Mutation, Args, Int, ResolveField, Parent,
} from '@nestjs/graphql';
import { ProductsService } from './products.service';
import {UpdateProductInput} from "../graphql/update-product.input";
import {ProductModel} from "../graphql/product.model";
import {ProductPage} from "../graphql/product-page.model";
import {CreateProductInput} from "../graphql/create-product.input";

@Resolver(() => ProductModel)
export class ProductsResolver {
    constructor(private readonly productsService: ProductsService) {}

    /* ──────────── Queries ──────────── */

    @Query(() => ProductPage, { name: 'products' })
    async getProducts(
        @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
        @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    ) {
        return this.productsService.findPaginated({ page, limit });
    }

    @Query(() => ProductModel, { name: 'product' })
    async getProduct(@Args('id', { type: () => Int }) id: number) {
        return this.productsService.findByIdOrThrow(id);
    }

    /* ──────────── Mutations ──────────── */

    @Mutation(() => ProductModel)
    async createProduct(
        @Args('data') data: CreateProductInput,
    ) {
        return this.productsService.create(data);
    }

    @Mutation(() => ProductModel)
    async updateProduct(
        @Args('data') data: UpdateProductInput,
    ) {
        const { id, ...rest } = data;
        return this.productsService.update(id, rest);
    }

    @Mutation(() => Boolean)
    async deleteProduct(
        @Args('id', { type: () => Int }) id: number,
    ) {
        await this.productsService.delete(id);
        return true;
    }

    /* ──────────── Field‑resolver ──────────── */

    @ResolveField('category', () => String, { nullable: true })
    async getCategoryName(@Parent() product: ProductModel) {
        const category = await this.productsService.getCategory(product.categoryId);
        return category?.name ?? null;
    }
}
