import { DataSource, SelectQueryBuilder } from 'typeorm';
import Comics from '../../entity/comics.entity';
import ComicsPagesDto from '../../../web/dto/comics-pages.dto';
import ComicsFilterBuilder from './comics-filter-builder';

describe('ComicsFilterBuilder', () => {
    let queryBuilderMock: jest.Mocked<SelectQueryBuilder<Comics>>;
    let dataSourceMock: jest.Mocked<DataSource>;

    beforeEach(() => {
        // Mock do SelectQueryBuilder
        queryBuilderMock = {
            innerJoin: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orWhere: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn(),
        } as unknown as jest.Mocked<SelectQueryBuilder<Comics>>;

        // Mock do DataSource e do Repository
        dataSourceMock = {
            getRepository: jest.fn().mockReturnValue({
                createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
            }),
        } as unknown as jest.Mocked<DataSource>;
    });

    it('should set take value correctly', () => {
        const comicsFilterBuilder = new ComicsFilterBuilder(dataSourceMock);
        comicsFilterBuilder.setTake(20);
        expect((comicsFilterBuilder as any).take).toBe(20);
    });

    it('should set skip value correctly', () => {
        const comicsFilterBuilder = new ComicsFilterBuilder(dataSourceMock);
        comicsFilterBuilder.setSkip(2);
        expect((comicsFilterBuilder as any).skip).toBe(2);
    });

    it('should call innerJoin with correct parameters', () => {
        const comicsFilterBuilder = new ComicsFilterBuilder(dataSourceMock);
        comicsFilterBuilder.innerJoin(
            'hq.author',
            'author',
            'author.id = :id',
            { id: 1 },
        );
        expect(queryBuilderMock.innerJoin).toHaveBeenCalledWith(
            'hq.author',
            'author',
            'author.id = :id',
            { id: 1 },
        );
    });

    it('should call leftJoin with correct parameters', () => {
        const comicsFilterBuilder = new ComicsFilterBuilder(dataSourceMock);
        comicsFilterBuilder.leftJoin(
            'hq.publisher',
            'publisher',
            'publisher.id = :id',
            { id: 1 },
        );
        expect(queryBuilderMock.leftJoin).toHaveBeenCalledWith(
            'hq.publisher',
            'publisher',
            'publisher.id = :id',
            { id: 1 },
        );
    });

    it('should build and return ComicsPagesDto correctly', async () => {
        const comicsFilterBuilder = new ComicsFilterBuilder(dataSourceMock);
        queryBuilderMock.getManyAndCount.mockResolvedValueOnce([
            [{ id: 1, title: 'Comic 1' } as unknown as Comics],
            15,
        ]);

        const result = await comicsFilterBuilder.build();

        expect(queryBuilderMock.take).toHaveBeenCalledWith(10);
        expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
        expect(result).toBeInstanceOf(ComicsPagesDto);
        expect(result.comics).toHaveLength(1);
        expect(result.pages).toBe(2); // 15 items with 10 per page => 2 pages
    });

    it('should calculate pages correctly', () => {
        const comicsFilterBuilder = new ComicsFilterBuilder(dataSourceMock);
        const pages = (comicsFilterBuilder as any).calcularPaginas(15, 10);
        expect(pages).toBe(2);
    });
});
