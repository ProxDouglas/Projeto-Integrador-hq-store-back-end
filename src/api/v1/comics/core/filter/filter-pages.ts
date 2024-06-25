import { Injectable } from '@nestjs/common';
import AWSConnectorS3 from '../../../comics-image/core/connector/aws-s3.connector';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import ComicsPagesDto from '../../web/dto/comics-pages.dto';
import FilterFactory from './filter-factory';
import Comics from '../entity/comics.entity';
import ComicsPagesQueryDto from '../../web/dto/comics-pages-query.dto';

@Injectable()
export default class FilterPages {
    private readonly connectorS3: AWSConnectorS3;
    private readonly filterFactory: FilterFactory;

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        connectorS3: AWSConnectorS3,
        filterFactory: FilterFactory,
    ) {
        this.connectorS3 = connectorS3;
        this.filterFactory = filterFactory;
    }

    async listPages(
        comicsPagesQueryDto: ComicsPagesQueryDto,
    ): Promise<ComicsPagesDto> {
        let queryBuilder = this.dataSource
            .getRepository(Comics)
            .createQueryBuilder('hq')
            .leftJoin('hq.image', 'hq_imagem', null, ['hq_imagem.id'])
            .addSelect(['hq_imagem.id', 'hq_imagem.name'])
            .leftJoinAndSelect('hq.collection', 'colecao')
            .take(comicsPagesQueryDto.take)
            .skip(comicsPagesQueryDto.skip * comicsPagesQueryDto.take);

        const filter = this.filterFactory.createFilter(
            comicsPagesQueryDto.typeFinder,
        );

        queryBuilder = filter.generateFinder(comicsPagesQueryDto, queryBuilder);

        return queryBuilder.getManyAndCount().then(([comics, comicsQtd]) => {
            const comicsPageDto = new ComicsPagesDto();
            comicsPageDto.comics = comics;
            comicsPageDto.pages = this.calcularPaginas(
                comicsQtd,
                comicsPagesQueryDto.take,
            );
            return this.gerarUrl(comicsPageDto);
            // return comicsPageDto;
        });
    }

    private async gerarUrl(comicsPageDto: ComicsPagesDto) {
        return Promise.all(
            comicsPageDto.comics.map(async (comics) => {
                if (comics.image)
                    return this.connectorS3
                        .getFile(comics.image.name)
                        .then((url) => url)
                        .catch(() => '');
                return '';
            }),
        )
            .then((imagesUrl) => {
                comicsPageDto.comics.forEach((comics, index) => {
                    if (comics.image) comics.image.url = imagesUrl[index];
                });
                return comicsPageDto;
            })
            .catch(() => comicsPageDto);
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
