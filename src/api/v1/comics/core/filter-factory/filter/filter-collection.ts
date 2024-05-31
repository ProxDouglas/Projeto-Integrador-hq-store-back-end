import { SelectQueryBuilder } from 'typeorm';
import FilterFactory from '../interface/filter-factory';
import Comics from '../../entity/comics.entity';
import ComicsPagesQueryDto from '../../../web/dto/comics-pages-query.dto';
export default class FilterCollection implements FilterFactory {
    generateFinder(
        comicsPageDto: ComicsPagesQueryDto,
        selectQueryBuilder: SelectQueryBuilder<Comics>,
    ): SelectQueryBuilder<Comics> {
        if (comicsPageDto.keyword.length === 0) return selectQueryBuilder;

        return selectQueryBuilder.where('colecao.name LIKE :name', {
            name: `%${comicsPageDto.keyword[0]}%`,
        });
    }
}
