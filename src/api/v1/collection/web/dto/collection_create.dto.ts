import { ApiProperty } from '@nestjs/swagger';
import { Length, IsNotEmpty } from 'class-validator';
import ComicsAssociateDto from 'src/api/v1/comics/web/dto/comics-associate.dto';

export default class CollectionCreateDto {
    // @ApiProperty()
    id: number;

    @ApiProperty()
    @Length(2, 155)
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @Length(0, 700)
    description: string;

    @ApiProperty()
    comics: ComicsAssociateDto[];
}
