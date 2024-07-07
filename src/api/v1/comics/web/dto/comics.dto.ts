import { ApiProperty } from '@nestjs/swagger';
import ComicsImageDto from 'src/api/v1/comics-image/web/dto/comics-image.dto';

export default class ComicsDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    year_publication: number;

    @ApiProperty()
    month_publication: number;

    @ApiProperty()
    number_pages: number;

    @ApiProperty()
    publisher: string;

    @ApiProperty()
    age_rating: number;

    @ApiProperty()
    price: number;

    @ApiProperty()
    image: ComicsImageDto;
}
