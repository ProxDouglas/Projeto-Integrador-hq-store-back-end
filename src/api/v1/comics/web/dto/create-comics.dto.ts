import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    Min,
    Max,
    Length,
    IsNotEmpty,
    IsNumber,
    IsPositive,
} from 'class-validator';

export default class CreateComicsDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    @Length(2, 255)
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsInt()
    @Min(1900)
    @Max(2100)
    @IsNotEmpty()
    year_publication: number;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @Min(1)
    @Max(12)
    @IsNotEmpty()
    month_publication: number;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @Min(1)
    @Max(9999)
    @IsNotEmpty()
    number_pages: number;

    @ApiProperty()
    @Length(2, 255)
    @IsNotEmpty()
    publisher: string;

    @ApiProperty()
    @IsInt()
    @Min(0)
    @Max(18)
    @IsNotEmpty()
    age_rating: number;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    price: number;

    constructor(createComicsDto?: Partial<CreateComicsDto>) {
        this.id = createComicsDto?.id ?? 0;
        this.name = createComicsDto?.name ?? '';
        this.year_publication = createComicsDto?.year_publication ?? 0;
        this.month_publication = createComicsDto?.month_publication ?? 0;
        this.number_pages = createComicsDto?.number_pages ?? 0;
        this.publisher = createComicsDto?.publisher ?? '';
        this.age_rating = createComicsDto?.age_rating ?? 0;
        this.price = createComicsDto?.price ?? 0;
    }
}
