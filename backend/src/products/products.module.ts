import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import {ProductsApiController} from "./products-api.controller";
import {ProductsResolver} from "./products.resolver";

@Module({
  controllers: [ProductsController, ProductsApiController],
  providers: [ProductsService, ProductsResolver],
})
export class ProductsModule {}
