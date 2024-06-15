import { Injectable } from '@nestjs/common';
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
import ResponseException from '../../../exception/response.exception';
import AWSConnectorS3 from 'src/api/v1/comics-image/core/connector/aws-s3.connector';

@Injectable()
export default class ComicsPagesService {
    private readonly filterMap: Map<TypeFinder, FilterFactory>;
    private readonly connectorS3: AWSConnectorS3;

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        connectorS3: AWSConnectorS3,
    ) {
        this.connectorS3 = connectorS3;
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
            .addSelect(['hq_imagem.id', 'hq_imagem.name'])
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

    async gerarUrl(comicsPageDto: ComicsPagesDto) {
        return Promise.all(
            comicsPageDto.comics.map(async (comics) => {
                if (comics.images.length > 0)
                    return this.connectorS3
                        .getFile(comics.images[0].name)
                        .then((url) => url)
                        .catch(() => '');
                return '';
            }),
        )
            .then((imagesUrl) => {
                comicsPageDto.comics.forEach((comics, index) => {
                    if (comics.images.length > 0)
                        comics.images[0].url = imagesUrl[index];
                });
                return comicsPageDto;
            })
            .catch(() => comicsPageDto);
    }

    private calcularPaginas(dividendo: number, divisor: number) {
        let resultado = dividendo / divisor;
        if (dividendo % divisor !== 0) {
            resultado++;
        }
        return resultado;
    }
}
