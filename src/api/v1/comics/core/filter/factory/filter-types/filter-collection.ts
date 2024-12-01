import { ObjectLiteral } from 'typeorm';
import FilterFactory from '../interface/filter-types';
import ComicsFilterBuilder from '../../builder/comics-filter-builder';
import ComicsPagesQueryDto from '../../../../web/dto/comics-pages-query.dto';
export default class FilterCollection implements FilterFactory {
    addFilter(
        comicsPageDto: ComicsPagesQueryDto,
        comicsFilterBuilder: ComicsFilterBuilder,
    ): ComicsFilterBuilder {
        if (comicsPageDto.keyword.length === 0) return comicsFilterBuilder;

        const elements = this.createInConditionalQuery(comicsPageDto.keyword);
        const objectValues = this.buildObjectLiteral(comicsPageDto.keyword);

        comicsFilterBuilder
            .leftJoin('hq.collection', 'colecao')
            .andWhere('colecao.id IN (' + elements + ')', objectValues);

        return comicsFilterBuilder;
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
