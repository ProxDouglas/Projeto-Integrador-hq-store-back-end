import FilterAgePublication from './filter-age-publication';
import ComicsPagesQueryDto from '../../../../web/dto/comics-pages-query.dto';
import ComicsFilterBuilder from '../../builder/comics-filter-builder';
import ResponseException from '../../../../../exception/response.exception';

describe('FilterAgePublication', () => {
    let filter: FilterAgePublication;
    let comicsFilterBuilderMock: jest.Mocked<ComicsFilterBuilder>;

    beforeEach(async () => {
        filter = new FilterAgePublication();
        comicsFilterBuilderMock = {
            andWhere: jest.fn().mockReturnThis(),
        } as unknown as jest.Mocked<ComicsFilterBuilder>;
    });

    it('should add filter with valid input', () => {
        const comicsPageDto = new ComicsPagesQueryDto();
        comicsPageDto.typeFinder = 1;
        comicsPageDto.keyword = ['2023', '2024'];

        const result = filter.addFilter(comicsPageDto, comicsFilterBuilderMock);

        expect(comicsFilterBuilderMock.andWhere).toHaveBeenCalledWith(
            'hq.year_publication BETWEEN :date_ini AND :date_end',
            { date_ini: 2023, date_end: 2024 },
        );
        expect(result).toBe(comicsFilterBuilderMock);
    });

    it('should throw an exception with empty keyword', () => {
        const comicsPageDto = new ComicsPagesQueryDto();
        comicsPageDto.typeFinder = 1;
        comicsPageDto.keyword = [];

        const filter = new FilterAgePublication();

        expect(() => {
            filter.addFilter(comicsPageDto, comicsFilterBuilderMock);
        }).toThrow(ResponseException);
    });

    it('should handle single-date input', () => {
        const comicsPageDto = new ComicsPagesQueryDto();
        comicsPageDto.typeFinder = 1;
        comicsPageDto.keyword = ['1990'];

        const result = filter.addFilter(comicsPageDto, comicsFilterBuilderMock);

        expect(result).toBe(comicsFilterBuilderMock);
        expect(comicsFilterBuilderMock.andWhere).toHaveBeenCalledWith(
            'hq.year_publication BETWEEN :date_ini AND :date_end',
            {
                date_ini: 1990,
                date_end: 2900,
            },
        );
    });
});
