import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComicBookModule } from './api/v1/ComicBook/comic-book.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.development.local'],
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            synchronize: true,
            ssl: process.env.DATABASE_SSL === 'true',
            entities: [`${__dirname}/**/*.entity{.js,.ts}`],
        }),
        ComicBookModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
