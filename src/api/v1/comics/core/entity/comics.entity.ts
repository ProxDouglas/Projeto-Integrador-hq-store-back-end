import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { IsInt, Min, Max, Length, IsNotEmpty, IsNumber } from 'class-validator';
import ComicsImage from '../../../comics-image/core/entity/comic-image.entity';
import Collection from '../../../collection/core/entity/collection.entity';
import CarrinhoItem from 'src/api/v1/carrinho/core/entity/carrinho-item.entity';

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

    @OneToOne(() => ComicsImage, (comicsImage) => comicsImage.comics)
    image: ComicsImage;

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

    @OneToMany(() => CarrinhoItem, (carrinho_item) => carrinho_item.comics)
    carrinho_item: CarrinhoItem;

    constructor(comics?: Partial<Comics>) {
        this.id = comics?.id;
        this.name = comics?.name;
        this.year_publication = comics?.year_publication;
        this.month_publication = comics?.month_publication;
        this.number_pages = comics?.number_pages;
        this.publisher = comics?.publisher;
        this.age_rating = comics?.age_rating;
        this.price = comics?.price;
        this.image = comics?.image;
        this.collection = comics?.collection;
        this.carrinho_item = comics?.carrinho_item;
    }
}
