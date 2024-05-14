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

@Entity({ name: 'fornecedor' })
export default class Fornecedor {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Length(2, 255)
    @IsNotEmpty()
    @Column({ name: 'nome', nullable: false })
    name: string;

    @Length(2, 255)
    @IsNotEmpty()
    @Column({ name: 'cnpj', type: 'varchar', nullable: false })
    cnpj: string;

    @Length(2, 255)
    @IsNotEmpty()
    @Column({ name: 'pais', type: 'varchar', nullable: false })
    pais: string;

}
