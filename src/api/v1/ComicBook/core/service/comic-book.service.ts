import { Injectable } from '@nestjs/common';
import ComicBook from '../entity/comic-book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ComicBookDto from '../../web/dto/comic-book.dto';

@Injectable()
export default class ComicBookService {
    constructor(
        @InjectRepository(ComicBook)
        private readonly comicBookRepository: Repository<ComicBook>,
        // private readonly comicBookMapper: ComicBookMapper,
    ) {}

    async list(): Promise<ComicBook[]> {
        return await this.comicBookRepository.find();
    }

    async getById(id: number): Promise<ComicBook> {
        return this.comicBookRepository.findOneBy({ id });
    }

    public async create(comicBookDto: ComicBookDto): Promise<ComicBookDto> {
        return this.comicBookRepository.save(comicBookDto);
    }

    public async update(
        id: number,
        createComicBookDto: ComicBookDto,
    ): Promise<ComicBookDto> {
        return await this.comicBookRepository
            .findOneBy({ id })
            .then((comicBook) => {
                if (createComicBookDto.name)
                    comicBook.name = createComicBookDto.name;

                if (createComicBookDto.year_publication)
                    comicBook.year_publication =
                        createComicBookDto.year_publication;

                if (createComicBookDto.month_publication)
                    comicBook.month_publication =
                        createComicBookDto.month_publication;

                if (createComicBookDto.number_pages)
                    comicBook.number_pages = createComicBookDto.number_pages;

                if (createComicBookDto.publisher)
                    comicBook.publisher = createComicBookDto.publisher;

                if (createComicBookDto.age_rating)
                    comicBook.age_rating = createComicBookDto.age_rating;

                if (createComicBookDto.price)
                    comicBook.price = createComicBookDto.price;

                return this.comicBookRepository.save(comicBook);
            });
    }

    public async delete(id: number) {
        this.comicBookRepository
            .findOneBy({ id })
            .then((comicBook) => this.comicBookRepository.delete(comicBook));
    }
}
