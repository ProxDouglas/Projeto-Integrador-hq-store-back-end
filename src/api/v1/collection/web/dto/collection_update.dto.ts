import { ApiProperty } from '@nestjs/swagger';
import { Length, IsNotEmpty } from 'class-validator';

export default class CollectionUpdateDto {
    // @ApiProperty()
    id: number;

    @ApiProperty()
    @Length(2, 155)
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @Length(0, 700)
    description: string;
}
