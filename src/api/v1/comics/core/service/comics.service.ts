import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Comics from '../entity/comics.entity';
import ComicsNotFound from '../../web/exception/comics-not-found';
import ComicsPagesDto from '../../web/dto/comics-pages.dto';
import ComicsPagesQueryDto from '../../web/dto/comics-pages-query.dto';
import AWSConnectorS3 from '../../../comics-image/core/connector/aws-s3.connector';
import SearchPages from '../serch/search-pages';
import CreateComicsDto from '../../web/dto/create-comics.dto';
import ComicsImage from '../../../comics-image/core/entity/comic-image.entity';
import ResponseException from '../../../exception/response.exception';

@Injectable()
export default class ComicsService {
    private readonly comicsRepository: Repository<Comics>;
    private readonly searchPages: SearchPages;
    private readonly connectorS3: AWSConnectorS3;

    constructor(
        @InjectRepository(Comics)
        comicsRepository: Repository<Comics>,
        searchPages: SearchPages,
        connectorS3: AWSConnectorS3,
    ) {
        this.comicsRepository = comicsRepository;
        this.searchPages = searchPages;
        this.connectorS3 = connectorS3;
    }

    async listPages(
        take: number,
        skip: number,
        comicsPagesQueryDtoList: ComicsPagesQueryDto[],
    ): Promise<ComicsPagesDto> {
        return this.searchPages
            .listPages(take, skip, comicsPagesQueryDtoList)
            .then(async (listComicsPageDto) => {
                for (const comics of listComicsPageDto.comics) {
                    await this.setUrlImage(comics.image);
                }

                return listComicsPageDto;
            })
            .catch((error) => {
                console.error(error);
                return Promise.reject(
                    new ResponseException(
                        400,
                        'Não foi possivel buscar as Hqs!',
                    ),
                );
            });
    }

    async getById(id: number): Promise<Comics> {
        return this.comicsRepository
            .findOneOrFail({
                where: { id: id },
                select: {
                    image: {
                        id: true,
                        name: true,
                    },
                },
                relations: { image: true, collection: true },
            })
            .then(async (comics) => {
                await this.setUrlImage(comics.image);
                return comics;
            })
            .catch(() => Promise.reject(new ComicsNotFound(id)));
    }

    private async setUrlImage(image: ComicsImage) {
        if (!image.name) image.url = '';
        else image.url = await this.connectorS3.getFile(image.name);
    }

    public async create(
        createComicsDto: CreateComicsDto,
    ): Promise<CreateComicsDto> {
        return this.comicsRepository.save(createComicsDto);
    }

    public async update(
        id: number,
        createComicsDto: CreateComicsDto,
    ): Promise<CreateComicsDto> {
        const comics = await this.comicsRepository
            .findOneBy({ id })
            .catch((error) => {
                return Promise.reject(
                    new ResponseException(
                        error?.status ?? 500,
                        error?.message ??
                            'Não foi possivel atualizar o registro!',
                    ),
                );
            });

        if (!comics) return Promise.reject(new ComicsNotFound(id));

        if (createComicsDto.name) comics.name = createComicsDto.name;

        if (createComicsDto.year_publication)
            comics.year_publication = createComicsDto.year_publication;

        if (createComicsDto.month_publication)
            comics.month_publication = createComicsDto.month_publication;

        if (createComicsDto.number_pages)
            comics.number_pages = createComicsDto.number_pages;

        if (createComicsDto.publisher)
            comics.publisher = createComicsDto.publisher;

        if (createComicsDto.age_rating)
            comics.age_rating = createComicsDto.age_rating;

        if (createComicsDto.price) comics.price = createComicsDto.price;

        return this.comicsRepository.save(comics).catch((error) => {
            return Promise.reject(
                new ResponseException(
                    error?.status ?? 500,
                    error?.message ?? 'Não foi possivel atualizar o registro!',
                ),
            );
        });
    }

    public async delete(id: number): Promise<void> {
        const comics = await this.comicsRepository
            .findOneBy({ id })
            .catch((error) => {
                return Promise.reject(
                    new ResponseException(
                        error?.status ?? 500,
                        error?.message ??
                            'Não foi possivel excluir o registro!',
                    ),
                );
            });

        if (!comics) return Promise.reject(new ComicsNotFound(id));

        this.comicsRepository.delete(comics).catch((error) => {
            console.error(error);
            return Promise.reject(
                new ResponseException(
                    500,
                    'Não foi possivel excluir o registro!',
                ),
            );
        });
    }
}
