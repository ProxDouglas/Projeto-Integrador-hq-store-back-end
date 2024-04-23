import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ComicBook from './core/entity/comic-book.entity';
import ComicBookService from './core/service/comic-book.service';
import ComicBookController from './web/controller/comic-book.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ComicBook])],
    controllers: [ComicBookController],
    providers: [ComicBookService],
})
export class ComicBookModule {}
