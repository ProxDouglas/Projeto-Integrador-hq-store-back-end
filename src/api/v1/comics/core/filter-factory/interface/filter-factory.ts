import { SelectQueryBuilder } from 'typeorm';
import Comics from '../../entity/comics.entity';
import ComicsPagesQueryDto from '../../../web/dto/comics-pages-query.dto';

// export default interface FilterFactory {
//     generateFinder(comicsPageDto: ComicsPagesQueryDto): FindOneOptions<Comics>;
// }
export default interface FilterFactory {
    generateFinder(
        comicsPageDto: ComicsPagesQueryDto,
        selectQueryBuilder: SelectQueryBuilder<Comics>,
    ): SelectQueryBuilder<Comics>;
}
