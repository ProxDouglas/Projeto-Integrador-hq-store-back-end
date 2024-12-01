import FilterFactory from '../interface/filter-types';
import ComicsPagesQueryDto from '../../../../web/dto/comics-pages-query.dto';
import ComicsFilterBuilder from '../../builder/comics-filter-builder';
export default class FilterEmpty implements FilterFactory {
    addFilter(
        comicsPageDto: ComicsPagesQueryDto,
        comicsFilterBuilder: ComicsFilterBuilder,
    ): ComicsFilterBuilder {
        return comicsFilterBuilder;
    }
}
