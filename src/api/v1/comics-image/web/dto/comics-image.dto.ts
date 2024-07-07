import { ApiProperty } from '@nestjs/swagger';
export default class ComicsImageDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    url: string;
}
