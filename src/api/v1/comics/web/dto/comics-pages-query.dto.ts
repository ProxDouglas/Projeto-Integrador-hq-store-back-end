import { ApiProperty } from '@nestjs/swagger';
import { TypeFinder } from '../../core/enum/TypeFinder';

export default class ComicsPagesQueryDto {
    // @ApiProperty({ required: false })
    take: number;

    // @ApiProperty({ required: false })
    skip: number;

    @ApiProperty({
        required: false,
        enum: TypeFinder,
        example: [
            '1 - name',
            '2 - year publication',
            '3 - publisher',
            '4 - price',
            '5 - collection',
            '6 - ategory',
            '7 - author',
        ],
    })
    typeFinder: TypeFinder;

    @ApiProperty({ required: false })
    keyword: string[];
}
