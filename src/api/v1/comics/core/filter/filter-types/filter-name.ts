import { SelectQueryBuilder } from 'typeorm';
import FilterFactory from '../interface/filter-types';
import Comics from '../../entity/comics.entity';
import ComicsPagesQueryDto from '../../../web/dto/comics-pages-query.dto';
export default class FilterName implements FilterFactory {
    generateFinder(
        comicsPageDto: ComicsPagesQueryDto,
        selectQueryBuilder: SelectQueryBuilder<Comics>,
    ): SelectQueryBuilder<Comics> {
        if (comicsPageDto.keyword.length === 0) return selectQueryBuilder;
        return selectQueryBuilder.where('hq.name ILIKE :name', {
            name: `%${comicsPageDto.keyword[0]}%`,
        });
    }
}
