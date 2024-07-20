import { ApiProperty } from '@nestjs/swagger';
import { TypeFinder } from '../../core/enum/TypeFinder';

export default class ComicsPagesQueryDto {
    @ApiProperty({
        required: false,
        enum: TypeFinder,
        example: [
            '0 - name',
            '1 - year publication',
            '2 - publisher',
            '3 - price',
            '4 - collection',
            '5 - ategory',
            '6 - author',
        ],
    })
    typeFinder: TypeFinder;

    @ApiProperty({ required: false })
    keyword: string[];
}
