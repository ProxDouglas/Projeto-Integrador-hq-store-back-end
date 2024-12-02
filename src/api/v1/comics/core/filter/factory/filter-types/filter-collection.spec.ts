import FilterCollection from './filter-collection';
import ComicsPagesQueryDto from '../../../../web/dto/comics-pages-query.dto';
import ComicsFilterBuilder from '../../builder/comics-filter-builder';

describe('FilterCollection', () => {
    let filter: FilterCollection;
    let comicsFilterBuilderMock: jest.Mocked<ComicsFilterBuilder>;

    beforeEach(async () => {
        filter = new FilterCollection();
        comicsFilterBuilderMock = {
            andWhere: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
        } as unknown as jest.Mocked<ComicsFilterBuilder>;
    });

    it('should add filter with valid input', () => {
        const comicsPageDto = new ComicsPagesQueryDto();
        comicsPageDto.typeFinder = 4;
        comicsPageDto.keyword = ['1', '5', '6'];

        const result = filter.addFilter(comicsPageDto, comicsFilterBuilderMock);

        expect(comicsFilterBuilderMock.leftJoin).toHaveBeenCalledWith(
            'hq.collection',
            'colecao',
        );
        expect(comicsFilterBuilderMock.andWhere).toHaveBeenCalledWith(
            'colecao.id IN (:id0, :id1, :id2)',
            {
                id0: 1,
                id1: 5,
                id2: 6,
            },
        );
        expect(result).toBe(comicsFilterBuilderMock);
    });

    it('should return empty filter', () => {
        const comicsPageDto = new ComicsPagesQueryDto();
        comicsPageDto.typeFinder = 4;
        comicsPageDto.keyword = [];

        const filter = new FilterCollection();

        const result = filter.addFilter(comicsPageDto, comicsFilterBuilderMock);

        expect(result).toBe(comicsFilterBuilderMock);
    });
});
