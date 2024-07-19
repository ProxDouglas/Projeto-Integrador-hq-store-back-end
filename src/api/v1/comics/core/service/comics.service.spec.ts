import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Comics from '../entity/comics.entity';
import ComicsService from './comics.service';
import ComicsNotFound from '../../web/exception/comics-not-found';
import AWSConnectorS3 from '../../../comics-image/core/connector/aws-s3.connector';
import SearchPages from '../serch/search-pages';
import ComicsPagesQueryDto from '../../web/dto/comics-pages-query.dto';
import ComicsPagesDto from '../../web/dto/comics-pages.dto';
import CreateComicsDto from '../../web/dto/create-comics.dto';
import ComicsImage from '../../../comics-image/core/entity/comic-image.entity';
import CreateComicsMapper from '../../web/mapper/comics-mapper';

const comicsPagesDto = new ComicsPagesDto({
    comics: [
        {
            id: 2,
            name: 'Naruto v1',
            year_publication: 1999,
            month_publication: 9,
            number_pages: 30,
            publisher: 'Shonen Jumps',
            age_rating: 10,
            price: 29.99,
            image: {
                id: 4,
                name: 'images-2024-06-10-Naruto_v1-Naruto_v1.png',
                url: 'https://auth.pingpool.com.br:9000/hq-store/images-2024-06-10-Naruto_v1-Naruto_v1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ixJ5xS3yKC62Jfy9lfSn%2F20240719%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240719T182756Z&X-Amz-Expires=3600&X-Amz-Signature=b5c89033b26a88a1abcdfee40f351ab58ebd612a64a293077b3a5b1af1b75822&X-Amz-SignedHeaders=host&x-id=GetObject',
                comics_id: 0,
                comics: undefined,
            },
            collection: [
                {
                    id: 2,
                    name: 'Manga',
                    description: 'História em quadrinhos japonesas',
                    comics: [],
                },
                {
                    id: 3,
                    name: 'Naruto',
                    description: 'Volumes do Manga Naruto',
                    comics: [],
                },
            ],
            carrinho_item: null,
        },
        {
            id: 3,
            name: 'Naruto v2',
            year_publication: 1999,
            month_publication: 9,
            number_pages: 30,
            publisher: 'Shonen Jumps',
            age_rating: 10,
            price: 29.99,
            image: {
                id: 5,
                name: 'images-2024-06-12-Naruto_v2-naruto_v2.jpg',
                url: 'https://auth.pingpool.com.br:9000/hq-store/images-2024-06-12-Naruto_v2-naruto_v2.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ixJ5xS3yKC62Jfy9lfSn%2F20240719%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240719T182756Z&X-Amz-Expires=3600&X-Amz-Signature=3df969c98be18306b8b59c92074fe236710ba493b5221f40919734d3cebab32d&X-Amz-SignedHeaders=host&x-id=GetObject',
                comics_id: 0,
                comics: undefined,
            },
            collection: [
                {
                    id: 2,
                    name: 'Manga',
                    description: 'História em quadrinhos japonesas',
                    comics: [],
                },
                {
                    id: 3,
                    name: 'Naruto',
                    description: 'Volumes do Manga Naruto',
                    comics: [],
                },
            ],
            carrinho_item: null,
        },
        {
            id: 4,
            name: 'Naruto v3',
            year_publication: 1999,
            month_publication: 9,
            number_pages: 30,
            publisher: 'Shonen Jumps',
            age_rating: 10,
            price: 29.99,
            image: {
                id: 6,
                name: 'images-2024-06-12-Naruto_v3-Naruto_v3.png',
                url: 'https://auth.pingpool.com.br:9000/hq-store/images-2024-06-12-Naruto_v3-Naruto_v3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ixJ5xS3yKC62Jfy9lfSn%2F20240719%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240719T182756Z&X-Amz-Expires=3600&X-Amz-Signature=a8d77df06508eed2f96147731b11eedbe30e2b354b77abc54e52c61d61ccbb4c&X-Amz-SignedHeaders=host&x-id=GetObject',
                comics_id: 0,
                comics: null,
            },
            collection: [
                {
                    id: 2,
                    name: 'Manga',
                    description: 'História em quadrinhos japonesas',
                    comics: [],
                },
                {
                    id: 3,
                    name: 'Naruto',
                    description: 'Volumes do Manga Naruto',
                    comics: [],
                },
            ],
            carrinho_item: null,
        },
    ],
    pages: 1,
});

describe('ComicsService', () => {
    let service: ComicsService;
    let repository: Repository<Comics>;
    let searchPages: SearchPages;
    let connectorS3: AWSConnectorS3;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ComicsService,
                {
                    provide: getRepositoryToken(Comics),
                    useClass: Repository,
                },
                {
                    provide: SearchPages,
                    useValue: {
                        listPages: jest.fn(),
                    },
                },
                {
                    provide: AWSConnectorS3,
                    useValue: {
                        getFile: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ComicsService>(ComicsService);
        repository = module.get<Repository<Comics>>(getRepositoryToken(Comics));
        searchPages = module.get<SearchPages>(SearchPages);
        connectorS3 = module.get<AWSConnectorS3>(AWSConnectorS3);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('listPages', () => {
        it('should list pages with image URLs', async () => {
            const comicsPagesQueryDto = new ComicsPagesQueryDto();

            jest.spyOn(searchPages, 'listPages').mockResolvedValue(
                comicsPagesDto,
            );

            comicsPagesQueryDto.take = 2;
            comicsPagesQueryDto.skip = 0;

            const result = await service.listPages(comicsPagesQueryDto);

            expect(result).toBe(comicsPagesDto);
        });
    });

    describe('getById', () => {
        it('should return a comic by id', async () => {
            const comics = new Comics();
            const comicsImage = new ComicsImage();
            comicsImage.name = 'image.jpg';
            comics.image = comicsImage;

            jest.spyOn(repository, 'findOneOrFail').mockResolvedValue(comics);
            jest.spyOn(connectorS3, 'getFile').mockResolvedValue('url');

            const result = await service.getById(1);

            expect(result).toBe(comics);
            expect(result.image.url).toBe('url');
        });

        it('should throw ComicsNotFound exception if comic is not found', async () => {
            jest.spyOn(repository, 'findOneOrFail').mockRejectedValue(
                new Error(),
            );

            await expect(service.getById(1)).rejects.toThrow(ComicsNotFound);
        });
    });

    describe('create', () => {
        it('should create a new comic', async () => {
            const comics = new Comics();
            const createComicsMapper = new CreateComicsMapper();

            comics.name = 'Melhores Histórias Da Mônica Por Mônica 01';
            comics.year_publication = 2023;
            comics.month_publication = 11;
            comics.number_pages = 64;
            comics.publisher = 'EDITORA MAURICIO de SOUZA ';
            comics.age_rating = 0;
            comics.price = 9.9;

            jest.spyOn(repository, 'save').mockResolvedValue(comics);

            const createComicsDto = createComicsMapper.toDto(comics);

            const result = await service.create(createComicsDto);

            expect(result).toBe(comics);
        });
    });

    describe('update', () => {
        it('should update a comic', async () => {
            const createComicsDto = new CreateComicsDto();
            const comics = new Comics();
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(comics);
            jest.spyOn(repository, 'save').mockResolvedValue(comics);

            const result = await service.update(1, createComicsDto);

            expect(result).toBe(comics);
        });

        it('should throw ComicsNotFound exception if comic is not found for update', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

            await expect(
                service.update(1, new CreateComicsDto()),
            ).rejects.toThrow(ComicsNotFound);
        });
    });

    describe('delete', () => {
        it('should delete a comic', async () => {
            const comics = new Comics();
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(comics);
            jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

            await service.delete(1);

            expect(repository.delete).toHaveBeenCalledWith(comics);
        });
    });
});
