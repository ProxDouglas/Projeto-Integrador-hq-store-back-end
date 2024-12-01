import ComicsPagesQueryDto from '../../../../web/dto/comics-pages-query.dto';
import ComicsFilterBuilder from '../../builder/comics-filter-builder';

export default interface FilterTypes {
    addFilter(
        comicsPageDto: ComicsPagesQueryDto,
        comicsFilterBuilder: ComicsFilterBuilder,
    ): ComicsFilterBuilder;
}
