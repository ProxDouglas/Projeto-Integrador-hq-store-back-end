import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import SearchPages from './search-pages';
import FilterFactory from '../filter/factory/filter-factory';
import ComicsFilterBuilder from '../filter/builder/comics-filter-builder';
import ComicsPagesQueryDto from '../../web/dto/comics-pages-query.dto';
import ComicsPagesDto from '../../web/dto/comics-pages.dto';
import { TypeFinder } from '../enum/TypeFinder';

jest.mock('../filter/builder/comics-filter-builder');

describe('SearchPages', () => {
    let searchPages: SearchPages;
    let dataSourceMock: jest.Mocked<DataSource>;
    let filterFactoryMock: jest.Mocked<FilterFactory>;
    let comicsFilterBuilderMock: jest.Mocked<ComicsFilterBuilder>;

    beforeEach(async () => {
        dataSourceMock = {
            getRepository: jest.fn(),
        } as unknown as jest.Mocked<DataSource>;

        comicsFilterBuilderMock = {
            setTake: jest.fn().mockReturnThis(),
            setSkip: jest.fn().mockReturnThis(),
            build: jest.fn().mockResolvedValue(new ComicsPagesDto()),
        } as unknown as jest.Mocked<ComicsFilterBuilder>;

        (ComicsFilterBuilder as jest.Mock).mockImplementation(
            () => comicsFilterBuilderMock,
        );

        filterFactoryMock = {
            build: jest.fn(),
        } as unknown as jest.Mocked<FilterFactory>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SearchPages,
                { provide: DataSource, useValue: dataSourceMock },
                { provide: FilterFactory, useValue: filterFactoryMock },
            ],
        }).compile();

        searchPages = module.get<SearchPages>(SearchPages);
    });

    it('should call ComicsFilterBuilder with correct parameters in listPages', async () => {
        const queryDtoList: ComicsPagesQueryDto[] = [];
        const result = await searchPages.listPages(10, 2, queryDtoList);

        expect(ComicsFilterBuilder).toHaveBeenCalledWith(dataSourceMock);
        expect(comicsFilterBuilderMock.setSkip).toHaveBeenCalledWith(2);
        expect(comicsFilterBuilderMock.setTake).toHaveBeenCalledWith(10);
        expect(comicsFilterBuilderMock.build).toHaveBeenCalled();
        expect(result).toBeInstanceOf(ComicsPagesDto);
    });

    it('should add filters correctly in adicionarFiltros', () => {
        const comicsPagesQueryDtoList: ComicsPagesQueryDto[] = [
            { typeFinder: TypeFinder.NAME, keyword: ['Naruto'] },
            {
                typeFinder: TypeFinder.YEAR_PUBLICATION,
                keyword: ['2023', '2024'],
            },
        ];

        const mockFilter = {
            addFilter: jest.fn(),
        };

        filterFactoryMock.build.mockImplementation(() => {
            return mockFilter;
        });

        searchPages['adicionarFiltros'](
            comicsPagesQueryDtoList,
            comicsFilterBuilderMock,
        );

        expect(filterFactoryMock.build).toHaveBeenCalledTimes(2);
        expect(mockFilter.addFilter).toHaveBeenCalledTimes(2);
        expect(mockFilter.addFilter).toHaveBeenCalledWith(
            comicsPagesQueryDtoList[0],
            comicsFilterBuilderMock,
        );
        expect(mockFilter.addFilter).toHaveBeenCalledWith(
            comicsPagesQueryDtoList[1],
            comicsFilterBuilderMock,
        );
    });
});
