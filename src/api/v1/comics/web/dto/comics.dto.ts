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
    id: number;

    @Length(2, 255)
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Min(1900)
    @Max(2100)
    @IsNotEmpty()
    year_publication: number;

    @IsInt()
    @IsPositive()
    @Min(1)
    @Max(12)
    @IsNotEmpty()
    month_publication: number;

    @IsInt()
    @IsPositive()
    @Min(1)
    @Max(9999)
    @IsNotEmpty()
    number_pages: number;

    @Length(2, 255)
    @IsNotEmpty()
    publisher: string;

    @IsInt()
    @IsPositive()
    @Min(0)
    @Max(18)
    @IsNotEmpty()
    age_rating: number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    price: number;

    // @OneToMany(() => ComicsImage, (ComicsImage) => ComicsImage.Comics)
    // images: ComicsImage[];
}
