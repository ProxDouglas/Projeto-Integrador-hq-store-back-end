import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import Comics from '../entity/comics.entity';
import FilterFactory from '../filter/filter-factory';
import SearchPages from './search-pages';
import ComicsPagesDto from '../../web/dto/comics-pages.dto';
import ComicsPagesQueryDto from '../../web/dto/comics-pages-query.dto';
import FilterEmpty from '../filter/filter-types/filter-empty';
import FilterName from '../filter/filter-types/filter-name';
import { TypeFinder } from '../enum/TypeFinder';

describe('SearchPages', () => {
    let searchPages: SearchPages;
    let dataSource: DataSource;
    let filterFactory: FilterFactory;
    let comicsRepository: Repository<Comics>;
    let queryBuilder: SelectQueryBuilder<Comics>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SearchPages,
                {
                    provide: DataSource,
                    useValue: {
                        getRepository: jest.fn().mockReturnValue({
                            createQueryBuilder: jest.fn(),
                        }),
                    },
                },
                {
                    provide: FilterFactory,
                    useValue: {
                        build: jest.fn(),
                    },
                },
            ],
        }).compile();

        searchPages = module.get<SearchPages>(SearchPages);
        dataSource = module.get<DataSource>(DataSource);
        filterFactory = module.get<FilterFactory>(FilterFactory);
        comicsRepository = dataSource.getRepository(Comics);
        queryBuilder = {
            leftJoin: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn(),
        } as any;

        (comicsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
            queryBuilder,
        );
    });

    it('should be defined', () => {
        expect(searchPages).toBeDefined();
    });

    it('should return a list of comics pages with FilterName', async () => {
        const queryDto: ComicsPagesQueryDto = {
            take: 10,
            skip: 0,
            typeFinder: TypeFinder.NAME,
            keyword: ['Naruto'],
        };

        const mockComics: Comics[] = [
            {
                id: 1,
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
                    url: 'https://example.com/image.png',
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
        ];

        const expectedResult = new ComicsPagesDto();
        expectedResult.comics = mockComics;
        expectedResult.pages = 1;

        const filterName = new FilterName();
        jest.spyOn(filterFactory, 'build').mockReturnValue(filterName);
        jest.spyOn(filterName, 'generateFinder').mockImplementation(
            (dto, qb) => qb,
        );

        jest.spyOn(queryBuilder, 'getManyAndCount').mockResolvedValue([
            mockComics,
            1,
        ]);

        const result = await searchPages.listPages(queryDto);

        expect(result).toEqual(expectedResult);
        expect(filterFactory.build).toHaveBeenCalledWith(TypeFinder.NAME);
        expect(filterName.generateFinder).toHaveBeenCalledWith(
            queryDto,
            queryBuilder,
        );
    });

    it('should return a list of comics pages with FilterEmpty', async () => {
        const queryDto: ComicsPagesQueryDto = {
            take: 10,
            skip: 0,
            typeFinder: undefined,
            keyword: [],
        };

        const mockComics: Comics[] = [
            {
                id: 1,
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
                    url: 'https://example.com/image.png',
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
        ];

        const expectedResult = new ComicsPagesDto();
        expectedResult.comics = mockComics;
        expectedResult.pages = 1;

        const filterEmpty = new FilterEmpty();
        jest.spyOn(filterFactory, 'build').mockReturnValue(filterEmpty);
        jest.spyOn(filterEmpty, 'generateFinder').mockImplementation(
            (dto, qb) => qb,
        );

        jest.spyOn(queryBuilder, 'getManyAndCount').mockResolvedValue([
            mockComics,
            1,
        ]);

        const result = await searchPages.listPages(queryDto);

        expect(result).toEqual(expectedResult);
        expect(filterFactory.build).toHaveBeenCalledWith(undefined);
        expect(filterEmpty.generateFinder).toHaveBeenCalledWith(
            queryDto,
            queryBuilder,
        );
    });

    it('should calculate pages correctly', () => {
        expect(searchPages['calcularPaginas'](10, 5)).toBe(2);
        expect(searchPages['calcularPaginas'](10, 3)).toBe(4);
        expect(searchPages['calcularPaginas'](10, 0)).toBe(1);
    });
});
