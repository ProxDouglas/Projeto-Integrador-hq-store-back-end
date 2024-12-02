import FilterName from './filter-name';
import ComicsPagesQueryDto from '../../../../web/dto/comics-pages-query.dto';
import ComicsFilterBuilder from '../../builder/comics-filter-builder';

describe('FilterName', () => {
    let filter: FilterName;
    let comicsFilterBuilderMock: jest.Mocked<ComicsFilterBuilder>;

    beforeEach(async () => {
        filter = new FilterName();
        comicsFilterBuilderMock = {
            andWhere: jest.fn().mockReturnThis(),
        } as unknown as jest.Mocked<ComicsFilterBuilder>;
    });

    it('should add filter with valid input', () => {
        const comicsPageDto = new ComicsPagesQueryDto();
        comicsPageDto.typeFinder = 4;
        comicsPageDto.keyword = ['Naruto'];

        const result = filter.addFilter(comicsPageDto, comicsFilterBuilderMock);

        expect(comicsFilterBuilderMock.andWhere).toHaveBeenCalledWith(
            'hq.name ILIKE :name',
            {
                name: '%Naruto%',
            },
        );
        expect(result).toBe(comicsFilterBuilderMock);
    });

    it('should return empty filter', () => {
        const comicsPageDto = new ComicsPagesQueryDto();
        comicsPageDto.typeFinder = 4;
        comicsPageDto.keyword = [];

        const filter = new FilterName();

        const result = filter.addFilter(comicsPageDto, comicsFilterBuilderMock);

        expect(result).toBe(comicsFilterBuilderMock);
    });
});
