import { IsInt, Min, Max, Length, IsNotEmpty, IsNumber } from 'class-validator';

export default class ComicBookDto {
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
    @Min(1)
    @Max(12)
    @IsNotEmpty()
    month_publication: number;

    @IsInt()
    @Min(1)
    @Max(9999)
    @IsNotEmpty()
    number_pages: number;

    @Length(2, 255)
    @IsNotEmpty()
    publisher: number;

    @IsInt()
    @Min(0)
    @Max(18)
    @IsNotEmpty()
    age_rating: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    // @OneToMany(() => ComicsImage, (ComicsImage) => ComicsImage.ComicBook)
    // images: ComicsImage[];
}
