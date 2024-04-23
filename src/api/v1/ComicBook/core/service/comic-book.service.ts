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

    // public async updateComicBook(
    //   id: number,
    //   createComicBookDto: CreateComicBookDto,
    // ): Promise<CreateComicBookDto> {
    //   const comicBook = await this.comicBookRepository.findOneBy({ id });

    //   if (createComicBookDto.name) comicBook.name = createComicBookDto.name;

    //   if (createComicBookDto.name) comicBook.email = createComicBookDto.email;

    //   if (createComicBookDto.name) comicBook.phone = createComicBookDto.phone;

    //   if (createComicBookDto.name) comicBook.cpf = createComicBookDto.cpf;

    //   if (createComicBookDto.name) comicBook.password = createComicBookDto.password;

    //   return createComicBookDto;
    // }

    public async delete(id: number) {
        this.comicBookRepository.delete({ id });
    }
}
