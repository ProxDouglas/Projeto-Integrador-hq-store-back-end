import { Between, FindOneOptions } from 'typeorm';
import FilterFactory from '../interface/filter-factory';
import Comics from '../../entity/comics.entity';
import ComicsPagesQueryDto from '../../../web/dto/comics-pages-query.dto';

export default class FilterAgePublication implements FilterFactory {
    generateFinder(comicsPageDto: ComicsPagesQueryDto): FindOneOptions<Comics> {
        let findOneOptions: FindOneOptions<Comics>;
        if (comicsPageDto.keyword.length === 2)
            findOneOptions = {
                where: {
                    year_publication: Between(
                        parseInt(comicsPageDto.keyword[0]),
                        parseInt(comicsPageDto.keyword[1]),
                    ),
                },
            };
        return findOneOptions;
    }
}
