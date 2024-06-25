import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Comics from '../entity/comics.entity';
import ComicsDto from '../../web/dto/comics.dto';
import ComicsNotFound from '../../web/exception/comics-not-found';
import ComicsPagesDto from '../../web/dto/comics-pages.dto';
import ComicsPagesQueryDto from '../../web/dto/comics-pages-query.dto';
import AWSConnectorS3 from '../../../comics-image/core/connector/aws-s3.connector';
import FilterPages from '../filter/filter-pages';

@Injectable()
export default class ComicsService {
    private readonly comicsRepository: Repository<Comics>;
    private readonly filterPages: FilterPages;
    private readonly connectorS3: AWSConnectorS3;

    constructor(
        @InjectRepository(Comics)
        comicsRepository: Repository<Comics>,
        filterPages: FilterPages,
        connectorS3: AWSConnectorS3,
    ) {
        this.comicsRepository = comicsRepository;
        this.filterPages = filterPages;
        this.connectorS3 = connectorS3;
    }

    async list(): Promise<Comics[]> {
        return this.comicsRepository.find();
    }

    async listPages(
        comicsPagesQueryDto: ComicsPagesQueryDto,
    ): Promise<ComicsPagesDto> {
        return this.filterPages.listPages(comicsPagesQueryDto);
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
                await this.connectorS3
                    .getFile(comics.image.name)
                    .then((url) => (comics.image.url = url));
                return comics;
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
            .catch(() => Promise.reject(new ComicsNotFound(id)));
    }

    public async delete(id: number) {
        this.comicsRepository
            .findOneBy({ id })
            .then((comics) => this.comicsRepository.delete(comics));
    }
}
