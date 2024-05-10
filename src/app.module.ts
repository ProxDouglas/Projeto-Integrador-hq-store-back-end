import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { readdirSync } from 'fs';
import { join } from 'path';
import ComicsModule from './api/v1/comics/comics.module';
import ComicsImageModule from './api/v1/comics-image/comic-image.module';
import CollectionModule from './api/v1/collection/collection.module';

// const modulesDir = join(__dirname, 'api/v1');
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.development.local', '.env.development'],
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
        // ...importModules(modulesDir),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

// function importModules(dir: string) {
//     const modules = [];
//     const files = readdirSync(dir, { withFileTypes: true });

//     for (const file of files) {
//         if (file.isDirectory()) {
//             modules.push(...importModules(join(dir, file.name)));
//         } else if (file.name.endsWith('.module.js')) {
//             const modulePath = join(dir, file.name).replace(/\.js$/, '');
//             // eslint-disable-next-line @typescript-eslint/no-var-requires
//             const module = require(modulePath).default;
//             modules.push(module);
//         }
//     }

//     return modules;
// }
