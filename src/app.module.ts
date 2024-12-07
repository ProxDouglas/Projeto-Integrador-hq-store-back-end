import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ComicsModule from './api/v1/comics/comics.module';
import ComicsImageModule from './api/v1/comics-image/comic-image.module';
import CollectionModule from './api/v1/collection/collection.module';
import FornecedorModule from './api/v1/fornecedor/fornecedor.module';
import AutorModule from './api/v1/autor/autor.module';
import ApreciadorModule from './api/v1/apreciador/apreciador.module';
import CarrinhoModule from './api/v1/carrinho/carrinho.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [
                '.env.development.local',
                '.env.development',
                '.env',
                '.env.production',
            ],
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            logging: process.env.NODE_ENV.toLowerCase() == 'development',
            synchronize: true,
            ssl:
                process.env.DATABASE_SSL === 'true'
                    ? {
                          rejectUnauthorized: false,
                      }
                    : false,
            entities: [`${__dirname}/**/*.entity{.js,.ts}`],
        }),
        ComicsModule,
        ComicsImageModule,
        CollectionModule,
        FornecedorModule,
        AutorModule,
        ApreciadorModule,
        CarrinhoModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
