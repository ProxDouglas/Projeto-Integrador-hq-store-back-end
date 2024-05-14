import { ApiProperty } from '@nestjs/swagger';

export default class ComicsPagesQueryDto {
    @ApiProperty({ required: false })
    take: number;

    @ApiProperty({ required: false })
    skip: number;

    @ApiProperty({ required: false })
    keyword: string;
}
