import { FindOneOptions, Like } from 'typeorm';
import FilterFactory from '../interface/filter-factory';
import Comics from '../../entity/comics.entity';
import ComicsPagesQueryDto from '../../../web/dto/comics-pages-query.dto';

export default class FilterName implements FilterFactory {
    generateFinder(comicsPageDto: ComicsPagesQueryDto): FindOneOptions<Comics> {
        let findOneOptions: FindOneOptions<Comics>;
        if (comicsPageDto.keyword.length > 0)
            findOneOptions = {
                where: {
                    name: Like('%' + comicsPageDto.keyword[0] + '%'),
                },
            };
        return findOneOptions;
    }
}
