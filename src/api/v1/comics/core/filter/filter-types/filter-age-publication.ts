import { SelectQueryBuilder } from 'typeorm';
import FilterFactory from '../interface/filter-types';
import Comics from '../../entity/comics.entity';
import ComicsPagesQueryDto from '../../../web/dto/comics-pages-query.dto';
import ResponseException from '../../../../exception/response.exception';
export default class FilterAgePublication implements FilterFactory {
    generateFinder(
        comicsPageDto: ComicsPagesQueryDto,
        selectQueryBuilder: SelectQueryBuilder<Comics>,
    ): SelectQueryBuilder<Comics> {
        let dataInicial = 1900;
        let dataFinal = 2900;

        if (comicsPageDto.keyword.length === 0)
            throw new ResponseException(
                400,
                'To search comics by date, enter the start date!',
            );

        if (comicsPageDto.keyword[0])
            dataInicial = parseInt(comicsPageDto.keyword[0]);

        if (comicsPageDto.keyword.length === 2 && comicsPageDto.keyword[1])
            dataFinal = parseInt(comicsPageDto.keyword[1]);

        return selectQueryBuilder.where(
            'hq.year_publication BETWEEN :date_ini AND :date_end',
            {
                date_ini: dataInicial,
                date_end: dataFinal,
            },
        );
    }
}
