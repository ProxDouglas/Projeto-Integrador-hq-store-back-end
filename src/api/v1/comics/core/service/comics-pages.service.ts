import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import Comics from '../entity/comics.entity';
import ComicsPagesDto from '../../web/dto/comics-pages.dto';
import ComicsPagesQueryDto from '../../web/dto/comics-pages-query.dto';
import { TypeFinder } from '../enum/TypeFinder';
import FilterName from '../filter-factory/filter/filter-name';
import FilterFactory from '../filter-factory/interface/filter-factory';
import FilterAgePublication from '../filter-factory/filter/filter-age-publication';
import FilterCollection from '../filter-factory/filter/filter-collection';
import ResponseException from 'src/api/v1/exception/response.exception';

@Injectable()
export default class ComicsPagesService {
    private readonly filterMap: Map<TypeFinder, FilterFactory>;

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {
        this.filterMap = new Map<TypeFinder, FilterFactory>([
            [TypeFinder.NAME, new FilterName()],
            [TypeFinder.YEAR_PUBLICATION, new FilterAgePublication()],
            [TypeFinder.COLLECTION, new FilterCollection()],
        ]);
    }

    async listPages(
        comicsPagesQueryDto: ComicsPagesQueryDto,
    ): Promise<ComicsPagesDto> {
        let queryBuilder = this.dataSource
            .getRepository(Comics)
            .createQueryBuilder('hq')
            .leftJoin('hq.images', 'hq_imagem', null, ['hq_imagem.id'])
            .addSelect(['hq_imagem.id'])
            .leftJoinAndSelect('hq.collection', 'colecao')
            .take(comicsPagesQueryDto.take ?? 10)
            .skip(comicsPagesQueryDto.skip ?? 0);

        const filterFactory = this.filterMap.get(
            comicsPagesQueryDto.typeFinder,
        );

        if (filterFactory) {
            try {
                queryBuilder = filterFactory.generateFinder(
                    comicsPagesQueryDto,
                    queryBuilder,
                );
            } catch (error) {
                return Promise.reject(
                    new ResponseException(error.statusCode, error.message),
                );
            }
        }

        return queryBuilder.getManyAndCount().then(([comics, pages]) => {
            const comicsPageDto = new ComicsPagesDto();
            comicsPageDto.comics = comics;
            comicsPageDto.pages = pages;
            return comicsPageDto;
        });
    }
}
