import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import ComicsService from './comics.service';
import Comics from '../entity/comics.entity';
import ComicsNotFound from '../../web/exception/comics-not-found';
import ComicsPagesDto from '../../web/dto/comics-pages.dto';
import AWSConnectorS3 from '../../../comics-image/core/connector/aws-s3.connector';
import SearchPages from '../serch/search-pages';
import CreateComicsDto from '../../web/dto/create-comics.dto';
import ResponseException from '../../../exception/response.exception';

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
    let comicsRepositoryMock: jest.Mocked<Repository<Comics>>;
    let searchPagesMock: jest.Mocked<SearchPages>;
    let awsConnectorS3Mock: jest.Mocked<AWSConnectorS3>;

    beforeEach(async () => {
        comicsRepositoryMock = {
            findOneOrFail: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<Repository<Comics>>;

        searchPagesMock = {
            listPages: jest.fn(),
        } as unknown as jest.Mocked<SearchPages>;

        awsConnectorS3Mock = {
            getFile: jest.fn(),
        } as unknown as jest.Mocked<AWSConnectorS3>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ComicsService,
                { provide: 'ComicsRepository', useValue: comicsRepositoryMock },
                { provide: SearchPages, useValue: searchPagesMock },
                { provide: AWSConnectorS3, useValue: awsConnectorS3Mock },
            ],
        }).compile();

        service = module.get<ComicsService>(ComicsService);
    });

    it('should list pages and set image URLs', async () => {
        searchPagesMock.listPages.mockResolvedValue(comicsPagesDto);
        awsConnectorS3Mock.getFile.mockResolvedValue(
            'https://url-to-s3.com/images-2024-06-10-Naruto_v1-Naruto_v1.png',
        );

        const result = await service.listPages(10, 0, []);

        expect(searchPagesMock.listPages).toHaveBeenCalledWith(10, 0, []);
        expect(awsConnectorS3Mock.getFile).toHaveBeenCalledTimes(3);
        expect(result.comics[0].image.url).toBe(
            'https://url-to-s3.com/images-2024-06-10-Naruto_v1-Naruto_v1.png',
        );
    });

    it('should throw ResponseException when listPages fails', async () => {
        searchPagesMock.listPages.mockRejectedValue(new Error('Failed'));

        await expect(service.listPages(10, 0, [])).rejects.toThrow(
            ResponseException,
        );
    });

    it('should get comic by id and set image URL', async () => {
        const comic = { id: 1, image: { name: 'test.jpg', url: '' } } as Comics;
        comicsRepositoryMock.findOneOrFail.mockResolvedValue(comic);
        awsConnectorS3Mock.getFile.mockResolvedValue(
            'https://url-to-s3.com/test.jpg',
        );

        const result = await service.getById(1);

        expect(comicsRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
            where: { id: 1 },
            select: { image: { id: true, name: true } },
            relations: { image: true, collection: true },
        });
        expect(awsConnectorS3Mock.getFile).toHaveBeenCalledWith('test.jpg');
        expect(result.image.url).toBe('https://url-to-s3.com/test.jpg');
    });

    it('should throw ComicsNotFound when comic not found', async () => {
        comicsRepositoryMock.findOneOrFail.mockRejectedValue(new Error());

        await expect(service.getById(1)).rejects.toThrow(ComicsNotFound);
    });

    describe('create', () => {
        it('should create a new comic', async () => {
            const comics = new Comics();
            // const createComicsMapper = new CreateComicsMapper();

            comics.name = 'Melhores Histórias Da Mônica Por Mônica 01';
            comics.year_publication = 2023;
            comics.month_publication = 11;
            comics.number_pages = 64;
            comics.publisher = 'EDITORA MAURICIO de SOUZA ';
            comics.age_rating = 0;
            comics.price = 9.9;
            comicsRepositoryMock.save.mockResolvedValue(comics);

            // const createComicsDto = createComicsMapper.toDto(comics);

            const result = await service.create(comics);

            expect(comicsRepositoryMock.save).toHaveBeenCalledWith(comics);
            expect(result).toBe(comics);
        });
    });

    describe('update', () => {
        it('should update an existing comic', async () => {
            const comic = { id: 1, name: 'Old Name' } as Comics;
            const updatedDto = new CreateComicsDto();
            updatedDto.name = 'New Name';

            comicsRepositoryMock.findOneBy.mockResolvedValue(comic);
            comicsRepositoryMock.save.mockResolvedValue({
                ...comic,
                ...updatedDto,
            });

            const result = await service.update(1, updatedDto);

            expect(comicsRepositoryMock.findOneBy).toHaveBeenCalledWith({
                id: 1,
            });
            expect(comicsRepositoryMock.save).toHaveBeenCalledWith(comic);
            expect(result.name).toBe('New Name');
        });
    });

    describe('delete', () => {
        it('should delete a comic by id', async () => {
            const comic = { id: 1 } as Comics;
            comicsRepositoryMock.findOneBy.mockResolvedValue(comic);
            comicsRepositoryMock.delete.mockResolvedValue(undefined);

            await service.delete(1);

            expect(comicsRepositoryMock.findOneBy).toHaveBeenCalledWith({
                id: 1,
            });
            expect(comicsRepositoryMock.delete).toHaveBeenCalledWith(comic);
        });

        it('should throw ComicsNotFound when trying to delete non-existing comic', async () => {
            comicsRepositoryMock.findOneBy.mockResolvedValue(null);

            await expect(service.delete(1)).rejects.toThrow(
                new ComicsNotFound(1),
            );
        });
    });
});
