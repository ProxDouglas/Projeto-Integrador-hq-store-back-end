import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import FilterFactory from '../interface/filter-factory';
import Comics from '../../entity/comics.entity';
import ComicsPagesQueryDto from '../../../web/dto/comics-pages-query.dto';
export default class FilterCollection implements FilterFactory {
    generateFinder(
        comicsPageDto: ComicsPagesQueryDto,
        selectQueryBuilder: SelectQueryBuilder<Comics>,
    ): SelectQueryBuilder<Comics> {
        if (comicsPageDto.keyword.length === 0) return selectQueryBuilder;

        const elements = this.createInConditionalQuery(comicsPageDto.keyword);
        const objectValues = this.buildObjectLiteral(comicsPageDto.keyword);

        selectQueryBuilder.where(
            'colecao.id IN (' + elements + ')',
            objectValues,
        );

        return selectQueryBuilder;
    }

    createInConditionalQuery(keywords: string[]): string {
        let elements = '';
        keywords.forEach((id, index) => {
            elements = elements + ':id' + index;
            if (index < keywords.length - 1) elements = elements + ', ';
        });

        return elements;
    }

    buildObjectLiteral(keywords: string[]): ObjectLiteral {
        const objectValues: ObjectLiteral = {};
        keywords.forEach((id, index) => {
            objectValues['id' + index] = parseInt(id);
        });
        return objectValues;
    }
}
