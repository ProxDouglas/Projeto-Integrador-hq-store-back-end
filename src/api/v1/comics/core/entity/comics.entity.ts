// import { ComicsImage } from 'src/api/v1/ComicsImages/core/entity/ComicsImage.entiry';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { IsInt, Min, Max, Length, IsNotEmpty, IsNumber } from 'class-validator';
import ComicsImage from 'src/api/v1/comics-image/core/entity/comic-image.entity';
import Collection from 'src/api/v1/collection/core/entity/collection.entity';

@Entity({ name: 'hq' })
export default class Comics {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Length(2, 255)
    @IsNotEmpty()
    @Column({ name: 'nome', nullable: false })
    name: string;

    @IsInt()
    @Min(1900)
    @Max(2100)
    @IsNotEmpty()
    @Column({ name: 'ano_publicacao', type: 'smallint', nullable: false })
    year_publication: number;

    @IsInt()
    @Min(1)
    @Max(12)
    @IsNotEmpty()
    @Column({ name: 'mes_publicacao', type: 'smallint', nullable: false })
    month_publication: number;

    @IsInt()
    @Min(1)
    @Max(9999)
    @IsNotEmpty()
    @Column({ name: 'numero_paginas', type: 'smallint', nullable: false })
    number_pages: number;

    @Length(2, 255)
    @IsNotEmpty()
    @Column({ name: 'publicadora', type: 'varchar', nullable: false })
    publisher: string;

    @IsInt()
    @Min(0)
    @Max(18)
    @IsNotEmpty()
    @Column({ name: 'faixa_etaria', type: 'smallint', nullable: false })
    age_rating: number;

    @IsNumber()
    @IsNotEmpty()
    @Column({ name: 'preco', type: 'float', nullable: false })
    price: number;

    @OneToMany(() => ComicsImage, (comicsImage) => comicsImage.comics)
    images: ComicsImage[];

    @ManyToMany(() => Collection)
    @JoinTable({
        name: 'hq_colecao',
        joinColumn: {
            name: 'hq_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: { name: 'colecao_id', referencedColumnName: 'id' },
    })
    collection: Collection[];
}
