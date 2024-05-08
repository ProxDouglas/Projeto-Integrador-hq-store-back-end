import { ApiProperty } from "@nestjs/swagger";

export default class ComicsPagesQueryDto {
    @ApiProperty()
    take: number;

    @ApiProperty()
    skip: number;

    @ApiProperty()
    keyword: string;
}
