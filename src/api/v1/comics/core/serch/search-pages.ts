import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import ComicsPagesDto from '../../web/dto/comics-pages.dto';
import FilterFactory from '../filter/filter-factory';
import Comics from '../entity/comics.entity';
import ComicsPagesQueryDto from '../../web/dto/comics-pages-query.dto';

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
        comicsPagesQueryDto: ComicsPagesQueryDto,
    ): Promise<ComicsPagesDto> {
        let queryBuilder = this.dataSource
            .getRepository(Comics)
            .createQueryBuilder('hq')
            .innerJoin('hq.image', 'hq_imagem', null, ['hq_imagem.id'])
            .addSelect(['hq_imagem.id', 'hq_imagem.name'])
            .take(comicsPagesQueryDto.take)
            .skip(comicsPagesQueryDto.skip * comicsPagesQueryDto.take);

        const filter = this.filterFactory.build(comicsPagesQueryDto.typeFinder);

        queryBuilder = filter.generateFinder(comicsPagesQueryDto, queryBuilder);

        return queryBuilder.getManyAndCount().then(([comics, comicsQtd]) => {
            const comicsPageDto = new ComicsPagesDto();
            comicsPageDto.comics = comics;
            comicsPageDto.pages = this.calcularPaginas(
                comicsQtd,
                comicsPagesQueryDto.take,
            );
            return comicsPageDto;
        });
    }

    private calcularPaginas(dividendo: number, divisor: number) {
        if (divisor === 0) return 1;

        let resultado = dividendo / divisor;
        if (dividendo % divisor !== 0) {
            resultado++;
        }
        return Math.floor(resultado);
    }
}
