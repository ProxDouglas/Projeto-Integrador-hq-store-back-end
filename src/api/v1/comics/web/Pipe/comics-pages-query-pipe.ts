import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import ComicsPagesQueryDto from '../dto/comics-pages-query.dto';
import { TypeFinder } from '../../core/enum/TypeFinder';

@Injectable()
export class ComicsPagesQueryValidationPipe implements PipeTransform {
    transform(query: any) {
        const comicsPagesQueryDto = new ComicsPagesQueryDto();

        // if (query.take && (isNaN(query.take) || parseInt(query.take) < 1))
        //     throw new BadRequestException('The take need be a integer');

        // if (query.skip && (isNaN(query.skip) || parseInt(query.skip) < 0))
        //     throw new BadRequestException('The skip need be a integer');

        comicsPagesQueryDto.take = 10;
        comicsPagesQueryDto.skip = 0;
        comicsPagesQueryDto.typeFinder = TypeFinder.NAME;
        comicsPagesQueryDto.keyword = query.keyword;

        if (
            Object.values(TypeFinder).includes(parseInt(query.typeFinder)) ===
            true
        )
            comicsPagesQueryDto.typeFinder = parseInt(query.typeFinder);

        if (!comicsPagesQueryDto.keyword) comicsPagesQueryDto.keyword = [];
        else if (
            comicsPagesQueryDto.keyword &&
            Array.isArray(comicsPagesQueryDto.keyword) === false
        )
            comicsPagesQueryDto.keyword = [comicsPagesQueryDto.keyword];

        return comicsPagesQueryDto;
    }
}
