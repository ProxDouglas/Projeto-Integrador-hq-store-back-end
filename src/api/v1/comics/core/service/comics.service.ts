import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
import Comics from '../entity/comics.entity';
import ComicsDto from '../../web/dto/comics.dto';
import ComicsNotFound from '../../web/exception/comics-not-found';
import ComicsPagesDto from '../../web/dto/comics-pages.dto';
import ComicsPagesQueryDto from '../../web/dto/comics-pages-query.dto';
import { TypeFinder } from '../enum/TypeFinder';
import FilterName from '../filter-factory/filter/filter-name';
import FilterFactory from '../filter-factory/interface/filter-factory';
import FilterAgePublication from '../filter-factory/filter/filter-age-publication';
import ComicsPagesService from './comics-pages.service';

@Injectable()
export default class ComicsService {
    private readonly comicsPagesService: ComicsPagesService;

    constructor(
        @InjectRepository(Comics)
        private readonly comicsRepository: Repository<Comics>,
        // private readonly comicsMapper: ComicsMapper,
        comicsPagesService: ComicsPagesService,
    ) {
        this.comicsPagesService = comicsPagesService;
    }

    async list(): Promise<Comics[]> {
        return this.comicsRepository.find();
    }

    async listPages(
        comicsPagesQueryDto: ComicsPagesQueryDto,
    ): Promise<ComicsPagesDto> {
        return this.comicsPagesService.listPages(comicsPagesQueryDto);
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
