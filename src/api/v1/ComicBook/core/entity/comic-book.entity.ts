// import { ComicsImage } from 'src/api/v1/ComicsImages/core/entity/ComicsImage.entiry';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, Min, Max, Length, IsNotEmpty, IsNumber } from 'class-validator';

@Entity({ name: 'hq' })
export default class ComicBook {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Length(2, 255)
    @IsNotEmpty()
    @Column({ nullable: false })
    name: string;

    @IsInt()
    @Min(1900)
    @Max(2100)
    @IsNotEmpty()
    @Column({ type: 'smallint', nullable: false })
    year_publication: number;

    @IsInt()
    @Min(1)
    @Max(12)
    @IsNotEmpty()
    @Column({ type: 'smallint', nullable: false })
    month_publication: number;

    @IsInt()
    @Min(1)
    @Max(9999)
    @IsNotEmpty()
    @Column({ type: 'smallint', nullable: false })
    number_pages: number;

    @Length(2, 255)
    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    publisher: number;

    @IsInt()
    @Min(0)
    @Max(18)
    @IsNotEmpty()
    @Column({ type: 'smallint', nullable: false })
    age_rating: number;

    @IsNumber()
    @IsNotEmpty()
    @Column({ type: 'float', nullable: false })
    price: number;

    // @OneToMany(() => ComicsImage, (ComicsImage) => ComicsImage.ComicBook)
    // images: ComicsImage[];
}
