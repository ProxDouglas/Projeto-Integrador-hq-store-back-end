import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import CollectionService from './collection.service';
import Collection from '../entity/collection.entity';
import Comics from '../../../comics/core/entity/comics.entity';
import { Repository, DataSource, SelectQueryBuilder } from 'typeorm';
import CollectionCreateMapper from '../../web/mapper/collection_create.mapper';
import CollectionNotFound from '../../web/exception/collection-not-found';
import ResponseException from '../../../exception/response.exception';
import CollectionCreateDto from '../../web/dto/collection_create.dto';
import CollectionUpdateDto from '../../web/dto/collection_update.dto';

describe('CollectionService', () => {
    let service: CollectionService;
    let collectionRepository: jest.Mocked<Repository<Collection>>;
    let queryBuilderMock: jest.Mocked<SelectQueryBuilder<Collection>>;
    let dataSourceMock: jest.Mocked<DataSource>;
    let mapperMock: jest.Mocked<CollectionCreateMapper>;

    beforeEach(async () => {
        collectionRepository = {
            findOneOrFail: jest.fn(),
            save: jest.fn(),
            findOneByOrFail: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnThis(),
        } as unknown as jest.Mocked<Repository<Collection>>;

        queryBuilderMock = {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            distinct: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
            values: jest.fn().mockReturnThis(),
        } as unknown as jest.Mocked<SelectQueryBuilder<Collection>>;

        dataSourceMock = {
            getRepository: jest.fn().mockReturnValue({
                createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
            }),
        } as unknown as jest.Mocked<DataSource>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CollectionService,
                {
                    provide: getRepositoryToken(Collection),
                    useValue: collectionRepository,
                },
                {
                    provide: getRepositoryToken(Comics),
                    useValue: {
                        find: jest
                            .fn()
                            .mockRejectedValue(new Comics({ id: 1 })),
                    },
                },
                {
                    provide: DataSource,
                    useValue: dataSourceMock,
                },
                {
                    provide: CollectionCreateMapper,
                    useValue: {
                        toEntity: jest.fn(),
                        toDto: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CollectionService>(CollectionService);
        mapperMock = module.get<jest.Mocked<CollectionCreateMapper>>(
            CollectionCreateMapper,
        );
    });

    describe('getById', () => {
        it('should return a collection by ID', async () => {
            const mockCollection = { id: 1 };
            collectionRepository.findOneOrFail.mockResolvedValueOnce(
                mockCollection as any,
            );

            const result = await service.getById(1);

            expect(result).toEqual(mockCollection);
            expect(collectionRepository.findOneOrFail).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it('should throw CollectionNotFound when not found', async () => {
            collectionRepository.findOneOrFail.mockRejectedValue(new Error());

            await expect(service.getById(1)).rejects.toThrow(
                CollectionNotFound,
            );
        });
    });

    describe('create', () => {
        it('should create a new collection', async () => {
            const createDto = new CollectionCreateDto();
            createDto.name = 'Manga';
            createDto.description = 'Desenho japoneses!';
            const collection = new Collection();
            collection.id = 1;
            collection.name = 'Manga';
            collection.description = 'Desenho japoneses!';

            mapperMock.toEntity.mockReturnValue(collection);
            collectionRepository.save.mockResolvedValueOnce(collection);
            mapperMock.toDto.mockReturnValue(createDto);

            const result = await service.create(createDto);

            expect(result).toEqual(createDto);
            expect(mapperMock.toEntity).toHaveBeenCalledWith(createDto);
            expect(collectionRepository.save).toHaveBeenCalledWith(collection);
        });
    });

    describe('addComics', () => {
        it('should associate comics with a collection', async () => {
            const associateDto = [{ id: 1 }, { id: 2 }];
            queryBuilderMock.execute.mockResolvedValueOnce(true);

            await expect(
                service.addComics(1, associateDto),
            ).resolves.not.toThrow();
            expect(queryBuilderMock.execute).toHaveBeenCalled();
        });

        it('should throw ResponseException on failure', async () => {
            queryBuilderMock.execute.mockRejectedValueOnce(new Error('Teste'));

            await expect(service.addComics(1, [{ id: 1 }])).rejects.toThrow(
                ResponseException,
            );
        });
    });

    // describe('removeComics', () => {
    //     it('should remove comics from a collection', async () => {
    //         // collectionRepository.delete.mockResolvedValueOnce();

    //         await expect(service.removeComics(1, 2)).resolves.not.toThrow();
    //         expect(queryBuilderMock.delete).toHaveBeenCalled();
    //         expect(queryBuilderMock.where).toHaveBeenCalled();
    //     });

    //     it('should throw ResponseException on failure', async () => {
    //         queryBuilderMock.delete.mockRejectedValueOnce(
    //             new Error('firsy call') as never,
    //         );

    //         await expect(service.removeComics(1, 2)).rejects.toThrow(
    //             ResponseException,
    //         );
    //     });
    // });

    // describe('update', () => {
    //     it('should update a collection', async () => {
    //         const updateDto = new CollectionUpdateDto();
    //         updateDto.name = 'Manga';
    //         updateDto.description = 'Revistas de desenho Japoneses';
    //         const collection = new Collection();
    //         collection.id = 1;
    //         collection.name = 'Manga';
    //         collection.description = 'Revistas de desenho Japoneses';

    //         collectionRepository.findOneByOrFail.mockResolvedValueOnce(
    //             collection,
    //         );
    //         collectionRepository.save.mockResolvedValueOnce(collection);

    //         const result = await service.update(1, updateDto);

    //         expect(result).toEqual(collection);
    //         expect(collectionRepository.save).toHaveBeenCalled();
    //     });

    //     it('should throw CollectionNotFound if collection not found', async () => {
    //         collectionRepository.findOneByOrFail.mockRejectedValue(
    //             new Error('Error'),
    //         );

    //         await expect(
    //             service.update(1, {} as CollectionUpdateDto),
    //         ).rejects.toThrow(CollectionNotFound);
    //     });
    // });

    // describe('delete', () => {
    //     it('should delete a collection', async () => {
    //         const mockCollection = { id: 1 };

    //         collectionRepository.findOneOrFail.mockResolvedValueOnce(
    //             mockCollection as any,
    //         );
    //         // collectionRepository.delete.mockResolvedValue(true);

    //         const result = await service.delete(1);

    //         expect(result).toBe(true);
    //     });

    //     it('should throw CollectionNotFound if collection not found', async () => {
    //         collectionRepository.findOneOrFail.mockRejectedValue(new Error());

    //         await expect(service.delete(1)).rejects.toThrow(CollectionNotFound);
    //     });
    // });
});
