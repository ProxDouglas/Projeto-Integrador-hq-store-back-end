import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import ComicsService from './comics.service';
import Comics from '../entity/comics.entity';
import SearchPages from '../serch/search-pages';
import AWSConnectorS3 from '../../../comics-image/core/connector/aws-s3.connector';
import ComicsNotFound from '../../web/exception/comics-not-found';
import ResponseException from '../../../exception/response.exception';
import { getRepositoryToken } from '@nestjs/typeorm';
import ComicsPagesQueryDto from '../../web/dto/comics-pages-query.dto';
import ComicsPagesDto from '../../web/dto/comics-pages.dto';
import CreateComicsDto from '../../web/dto/create-comics.dto';
import ComicsImage from '../../../comics-image/core/entity/comic-image.entity';

describe('ComicsService', () => {
    let service: ComicsService;
    let comicsRepository: Repository<Comics>;
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
        comicsRepository = module.get<Repository<Comics>>(
            getRepositoryToken(Comics),
        );
        searchPages = module.get<SearchPages>(SearchPages);
        connectorS3 = module.get<AWSConnectorS3>(AWSConnectorS3);
    });

    describe('listPages', () => {
        it('should return a list of comics with image URLs', async () => {
            const comicsListMock = {
                comics: [{ image: { name: 'image1.png', url: '' } }],
            } as unknown as ComicsPagesDto;

            jest.spyOn(searchPages, 'listPages').mockResolvedValue(
                comicsListMock,
            );
            jest.spyOn(connectorS3, 'getFile').mockResolvedValue(
                'http://image-url',
            );

            const result = await service.listPages(
                10,
                0,
                [] as ComicsPagesQueryDto[],
            );

            expect(result).toEqual(comicsListMock);
            expect(connectorS3.getFile).toHaveBeenCalledWith('image1.png');
        });

        it('should throw a ResponseException on failure', async () => {
            jest.spyOn(searchPages, 'listPages').mockRejectedValue(
                new Error('Error'),
            );

            await expect(
                service.listPages(10, 0, [] as ComicsPagesQueryDto[]),
            ).rejects.toThrow(ResponseException);
        });
    });

    describe('getById', () => {
        it('should return a comic by ID', async () => {
            const comicsMock = new Comics();
            comicsMock.id = 1;
            comicsMock.image = new ComicsImage();
            comicsMock.image.name = 'image1.png';

            jest.spyOn(comicsRepository, 'findOneOrFail').mockResolvedValue(
                comicsMock,
            );
            jest.spyOn(connectorS3, 'getFile').mockResolvedValue(
                'http://image-url',
            );

            const result = await service.getById(1);

            expect(result).toEqual(comicsMock);
            expect(connectorS3.getFile).toHaveBeenCalledWith('image1.png');
        });

        it('should throw ComicsNotFound when no comic is found', async () => {
            jest.spyOn(comicsRepository, 'findOneOrFail').mockRejectedValue(
                new Error('Not Found'),
            );

            await expect(service.getById(1)).rejects.toThrow(ComicsNotFound);
        });

        it('should return a comic by ID without image name', async () => {
            const comicsMock = new Comics();
            comicsMock.id = 1;
            comicsMock.image = new ComicsImage();

            jest.spyOn(comicsRepository, 'findOneOrFail').mockResolvedValue(
                comicsMock,
            );
            jest.spyOn(connectorS3, 'getFile').mockResolvedValue(
                'http://image-url',
            );

            const result = await service.getById(1);

            expect(result).toEqual(comicsMock);
            expect(connectorS3.getFile).toHaveBeenCalledTimes(0);
            // toHaveBeenCalledWith
        });
    });

    describe('create', () => {
        it('should create a new comic', async () => {
            const createDto = new CreateComicsDto();
            createDto.name = 'New Comic';
            const comics = new Comics();
            comics.name = 'New Comic';

            jest.spyOn(comicsRepository, 'save').mockResolvedValue(comics);

            const result = await service.create(createDto);

            expect(result).toEqual(comics);
            expect(comicsRepository.save).toHaveBeenCalledWith(createDto);
        });
    });

    describe('update', () => {
        it('should update an existing comic', async () => {
            const existingComic = new Comics();
            existingComic.id = 1;
            existingComic.name = 'Naruto V1';
            existingComic.year_publication = 8;
            existingComic.month_publication = 5;
            existingComic.number_pages = 30;
            existingComic.publisher = 'Shonen Jump';
            existingComic.age_rating = 12;
            existingComic.price = 30.2;

            jest.spyOn(comicsRepository, 'findOneBy').mockResolvedValue(
                existingComic,
            );
            jest.spyOn(comicsRepository, 'save').mockResolvedValue(
                existingComic,
            );

            const updateDto = new CreateComicsDto();
            updateDto.id = 1;
            updateDto.name = 'Updated Comic';
            updateDto.year_publication = 9;
            updateDto.month_publication = 2;
            updateDto.number_pages = 32;
            updateDto.publisher = 'Shonen Jump ';
            updateDto.age_rating = 14;
            updateDto.price = 30.4;

            const result = await service.update(1, updateDto);

            expect(result).toEqual(existingComic);
            expect(comicsRepository.save).toHaveBeenCalledWith(existingComic);
        });

        it('should update an existing comic', async () => {
            const existingComic = new Comics();
            existingComic.id = 1;
            existingComic.name = 'Naruto V1';

            jest.spyOn(comicsRepository, 'findOneBy').mockResolvedValue(
                existingComic,
            );
            jest.spyOn(comicsRepository, 'save').mockRejectedValue(
                new ResponseException(
                    500,
                    'Não foi possivel atualizar o registro!',
                ),
            );

            const updateDto = new CreateComicsDto();
            updateDto.name = 'Updated Comic';

            await expect(service.update(1, updateDto)).rejects.toThrow(
                ResponseException,
            );
        });

        it('should throw ComicsNotFound when updating a non-existing comic', async () => {
            jest.spyOn(comicsRepository, 'findOneBy').mockResolvedValue(null);

            await expect(
                service.update(1, new CreateComicsDto()),
            ).rejects.toThrow(ComicsNotFound);
        });

        it('should throw ComicsNotFound when updating a non-existing comic', async () => {
            jest.spyOn(comicsRepository, 'findOneBy').mockRejectedValue(
                new ResponseException(
                    500,
                    'Não foi possivel atualizar o registro!',
                ),
            );

            await expect(
                service.update(1, new CreateComicsDto()),
            ).rejects.toThrow(ResponseException);
        });
    });

    describe('delete', () => {
        it('should delete a comic by ID', async () => {
            const comic = new Comics();
            comic.id = 1;

            jest.spyOn(comicsRepository, 'findOneBy').mockResolvedValue(comic);
            jest.spyOn(comicsRepository, 'delete').mockResolvedValue(null);

            await expect(service.delete(1)).resolves.toBeUndefined();
        });

        it('should throw ComicsNotFound when deleting a non-existing comic', async () => {
            jest.spyOn(comicsRepository, 'findOneBy').mockResolvedValue(null);

            await expect(service.delete(1)).rejects.toThrow(ComicsNotFound);
        });
    });
});
