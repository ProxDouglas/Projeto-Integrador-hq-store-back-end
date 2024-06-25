import { SelectQueryBuilder } from 'typeorm';
import FilterFactory from '../interface/filter-types';
import Comics from '../../entity/comics.entity';
import ComicsPagesQueryDto from '../../../web/dto/comics-pages-query.dto';
export default class FilterEmpty implements FilterFactory {
    generateFinder(
        comicsPageDto: ComicsPagesQueryDto,
        selectQueryBuilder: SelectQueryBuilder<Comics>,
    ): SelectQueryBuilder<Comics> {
        return selectQueryBuilder;
    }
}
