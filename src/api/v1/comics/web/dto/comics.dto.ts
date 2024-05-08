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

export default class ComicsDto {
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
    @IsPositive()
    @Min(0)
    @Max(18)
    @IsNotEmpty()
    age_rating: number;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    price: number;

    // @OneToMany(() => ComicsImage, (ComicsImage) => ComicsImage.Comics)
    // images: ComicsImage[];
}
