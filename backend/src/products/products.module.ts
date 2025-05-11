import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import {ProductsApiController} from "./products-api.controller";

@Module({
  controllers: [ProductsController, ProductsApiController],
  providers: [ProductsService],
})
export class ProductsModule {}
