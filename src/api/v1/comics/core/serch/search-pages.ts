import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import ComicsPagesDto from '../../web/dto/comics-pages.dto';
import FilterFactory from '../filter/factory/filter-factory';
import ComicsPagesQueryDto from '../../web/dto/comics-pages-query.dto';
import ComicsFilterBuilder from '../filter/builder/comics-filter-builder';

@Injectable()
export default class SearchPages {
    private readonly filterFactory: FilterFactory;

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        filterFactory: FilterFactory,
    ) {
        this.filterFactory = filterFactory;
    }

    async listPages(
        take: number,
        skip: number,
        comicsPagesQueryDtoList: ComicsPagesQueryDto[],
    ): Promise<ComicsPagesDto> {
        let comicsFilterBuilder = new ComicsFilterBuilder(this.dataSource);

        comicsFilterBuilder = comicsFilterBuilder.setSkip(skip).setTake(take);

        this.adicionarFiltros(comicsPagesQueryDtoList, comicsFilterBuilder);

        return comicsFilterBuilder.build();
    }

    private adicionarFiltros(
        comicsPagesQueryDtoList: ComicsPagesQueryDto[],
        comicsFilterBuilder: ComicsFilterBuilder,
    ) {
        if (Array.isArray(comicsPagesQueryDtoList))
            comicsPagesQueryDtoList.forEach(
                (comicsPagesQueryDto: ComicsPagesQueryDto) => {
                    const filter = this.filterFactory.build(
                        comicsPagesQueryDto.typeFinder,
                    );

                    if (filter)
                        filter.addFilter(
                            comicsPagesQueryDto,
                            comicsFilterBuilder,
                        );
                },
            );
    }
}
