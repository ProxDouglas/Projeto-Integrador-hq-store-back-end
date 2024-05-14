import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import ComicsPagesQueryDto from '../dto/comics-pages-query.dto';

@Injectable()
export class ComicsPagesQueryValidationPipe implements PipeTransform {
    transform(query: any) {
        const comicsPagesQueryDto = new ComicsPagesQueryDto();
        if (query.take && (isNaN(query.take) || parseInt(query.take) < 1))
            throw new BadRequestException('The take need be a integer');

        if (query.skip && (isNaN(query.skip) || parseInt(query.skip) < 0))
            throw new BadRequestException('The skip need be a integer');

        comicsPagesQueryDto.take = query.take;
        comicsPagesQueryDto.skip = query.skip;
        comicsPagesQueryDto.keyword = query.keyword ?? '';

        return comicsPagesQueryDto;
    }
}
