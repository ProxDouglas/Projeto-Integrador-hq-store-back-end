import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import Comics from '../entity/comics.entity';
import ComicsDto from '../../web/dto/comics.dto';
import ComicsNotFound from '../../web/exception/comics-not-found';
import ComicsPagesDto from '../../web/dto/comics-pages.dto';
import ComicsPagesQueryDto from '../../web/dto/comics-pages-query.dto';

@Injectable()
export default class ComicsService {
    constructor(
        @InjectRepository(Comics)
        private readonly comicsRepository: Repository<Comics>,
        // private readonly comicsMapper: ComicsMapper,
    ) {}

    async list(): Promise<Comics[]> {
        return this.comicsRepository.find();
    }

    async listPages(query: ComicsPagesQueryDto): Promise<ComicsPagesDto> {
        return this.comicsRepository
            .findAndCount({
                where: { name: Like('%' + query.keyword + '%') },
                take: query.take ?? 10,
                skip: query.skip ?? 0,
                select: {
                    images: {
                        id: true,
                    },
                },
                relations: { images: true, collection: true },
            })
            .then(([comics, pages]) => {
                const comicsPageDto = new ComicsPagesDto();
                comicsPageDto.comics = comics;
                comicsPageDto.pages = pages;
                return comicsPageDto;
            });
    }

    async getById(id: number): Promise<Comics> {
        return this.comicsRepository
            .findOneOrFail({
                where: { id: id },
                select: {
                    images: {
                        id: true,
                    },
                },
                relations: { images: true, collection: true },
            })
            .catch(() => Promise.reject(new ComicsNotFound(id)));
    }

    public async create(comicsDto: ComicsDto): Promise<ComicsDto> {
        return this.comicsRepository.save(comicsDto);
    }

    public async update(id: number, comicsDto: ComicsDto): Promise<ComicsDto> {
        return await this.comicsRepository
            .findOneBy({ id })
            .then((comics) => {
                if (comicsDto.name) comics.name = comicsDto.name;

                if (comicsDto.year_publication)
                    comics.year_publication = comicsDto.year_publication;

                if (comicsDto.month_publication)
                    comics.month_publication = comicsDto.month_publication;

                if (comicsDto.number_pages)
                    comics.number_pages = comicsDto.number_pages;

                if (comicsDto.publisher) comics.publisher = comicsDto.publisher;

                if (comicsDto.age_rating)
                    comics.age_rating = comicsDto.age_rating;

                if (comicsDto.price) comics.price = comicsDto.price;

                return this.comicsRepository.save(comics);
            })
            .catch(() => {
                throw new ComicsNotFound(id);
            });
    }

    public async delete(id: number) {
        this.comicsRepository
            .findOneBy({ id })
            .then((comics) => this.comicsRepository.delete(comics));
    }
}
