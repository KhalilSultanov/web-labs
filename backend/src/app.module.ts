// src/app.module.ts
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PrismaModule} from './prisma/prisma.module';
import {ProductsModule} from './products/products.module';

import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import {join} from 'path';

import {
    createComplexityRule,
    fieldExtensionsEstimator,
    simpleEstimator,
} from 'graphql-query-complexity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'schema.gql'),
            playground: true,
            sortSchema: true,

            validationRules: [
                (context) =>
                    createComplexityRule({
                        estimators: [
                            fieldExtensionsEstimator(),
                            simpleEstimator({defaultComplexity: 1}),
                        ],
                        maximumComplexity: 100,
                        onComplete: (cost: number) =>
                            console.log('Query complexity:', cost),
                    })(context),
            ],
        }),

        PrismaModule,
        ProductsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
