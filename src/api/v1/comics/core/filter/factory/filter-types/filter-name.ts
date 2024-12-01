import FilterFactory from '../interface/filter-types';
import ComicsPagesQueryDto from '../../../../web/dto/comics-pages-query.dto';
import ComicsFilterBuilder from '../../builder/comics-filter-builder';
export default class FilterName implements FilterFactory {
    addFilter(
        comicsPageDto: ComicsPagesQueryDto,
        comicsFilterBuilder: ComicsFilterBuilder,
    ): ComicsFilterBuilder {
        if (comicsPageDto.keyword.length === 0) return comicsFilterBuilder;
        return comicsFilterBuilder.andWhere('hq.name ILIKE :name', {
            name: `%${comicsPageDto.keyword[0]}%`,
        });
    }
}
